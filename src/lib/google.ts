import type { BrainFile, CalendarEvent, Mail, PersistedState, Task, Urgency } from "./types";
import {
  getOrCreateUserState,
  loadGoogleTokens,
  saveGoogleTokens,
  saveUserState,
  type GoogleTokens,
} from "./db";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";
const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";
const TASKS_BASE = "https://tasks.googleapis.com/tasks/v1";
const DRIVE_BASE = "https://www.googleapis.com/drive/v3";

function clientId(): string {
  return process.env.GOOGLE_CLIENT_ID ?? "";
}

function clientSecret(): string {
  return process.env.GOOGLE_CLIENT_SECRET ?? "";
}

export function redirectUri(): string {
  return process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:3000/api/google/callback";
}

export function googleConfigured(): boolean {
  return Boolean(clientId() && clientSecret());
}

export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
}

async function requestTokens(body: Record<string, string>): Promise<GoogleTokens> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      ...body,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
  const data = (await res.json()) as TokenResponse;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresAt: Date.now() + data.expires_in * 1000,
    scope: data.scope ?? "",
  };
}

export function exchangeCode(code: string): Promise<GoogleTokens> {
  return requestTokens({ code, grant_type: "authorization_code", redirect_uri: redirectUri() });
}

export function refreshTokens(refreshToken: string): Promise<GoogleTokens> {
  return requestTokens({ refresh_token: refreshToken, grant_type: "refresh_token" });
}

async function googleFetch(
  tokens: GoogleTokens,
  url: string,
): Promise<{ res: Response; tokens: GoogleTokens }> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
    signal: AbortSignal.timeout(15_000),
  });
  return { res, tokens };
}

const CRITICAL_RE =
  /\b(legal|invoice|urgent|asap|contract|breach|outage|payment failed|final notice|escalat)\b/i;
const HIGH_RE =
  /\b(deadline|today|tomorrow|review|approve|sign|launch|beta|asap|action required)\b/i;

function classifyUrgency(text: string): Urgency {
  if (CRITICAL_RE.test(text)) return "critical";
  if (HIGH_RE.test(text)) return "high";
  return "normal";
}

function timeLabel(iso: string | number | undefined): string {
  if (!iso) return "";
  const d = typeof iso === "number" ? new Date(iso) : new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

interface GmailListResponse {
  messages?: { id: string }[];
}

interface GmailMessageResponse {
  id: string;
  snippet?: string;
  internalDate?: string;
  labelIds?: string[];
  payload?: { headers?: { name: string; value: string }[] };
}

function headerOf(msg: GmailMessageResponse, name: string): string {
  const hit = msg.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return hit?.value ?? "";
}

export async function fetchGmailInbox(tokens: GoogleTokens, max = 12): Promise<Mail[]> {
  const listUrl = `${GMAIL_BASE}/messages?maxResults=${max}&labelIds=INBOX`;
  const { res: listRes } = await googleFetch(tokens, listUrl);
  if (!listRes.ok) throw new Error(`Gmail list failed: ${listRes.status}`);
  const list = (await listRes.json()) as GmailListResponse;
  const ids = (list.messages ?? []).map((m) => m.id);

  const mails: Mail[] = [];
  await Promise.all(
    ids.map(async (id) => {
      const url = `${GMAIL_BASE}/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`;
      const { res } = await googleFetch(tokens, url);
      if (!res.ok) return;
      const msg = (await res.json()) as GmailMessageResponse;
      const from = headerOf(msg, "From").replace(/\s*<[^>]+>\s*$/, "") || "Unknown sender";
      const subject = headerOf(msg, "Subject") || "(no subject)";
      mails.push({
        id: `g-${msg.id}`,
        from,
        subject,
        preview: msg.snippet ?? "",
        time: timeLabel(msg.internalDate),
        urgency: classifyUrgency(`${from} ${subject} ${msg.snippet ?? ""}`),
        unread: (msg.labelIds ?? []).includes("UNREAD"),
      });
    }),
  );
  return mails;
}

interface CalendarEventResponse {
  id: string;
  summary?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

export async function fetchCalendarToday(tokens: GoogleTokens): Promise<CalendarEvent[]> {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const params = new URLSearchParams({
    calendarId: "primary",
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "20",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const { res } = await googleFetch(tokens, `${CALENDAR_BASE}/events?${params}`);
  if (!res.ok) throw new Error(`Calendar list failed: ${res.status}`);
  const data = (await res.json()) as { items?: CalendarEventResponse[] };

  return (data.items ?? []).map((e) => {
      const allDay = Boolean(e.start?.date);
      const start = allDay ? "All day" : timeLabel(e.start?.dateTime);
      const end = allDay ? "" : timeLabel(e.end?.dateTime);
      const title = e.summary ?? "(untitled)";
      return {
        id: `gcal-${e.id}`,
        title,
        start,
        end,
        location: e.location,
        urgency: classifyUrgency(title) === "critical" ? "critical" : "normal",
      } satisfies CalendarEvent;
    });
}

interface GoogleTaskListResponse {
  items?: { id: string; title?: string }[];
}

interface GoogleTaskResponse {
  id: string;
  title?: string;
  notes?: string;
  due?: string;
  status?: string;
}

function dueLabel(iso: string | undefined): string {
  if (!iso) return "No date";
  const due = new Date(iso);
  if (Number.isNaN(due.getTime())) return "No date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return due.toLocaleDateString([], { month: "short", day: "numeric" });
}

export async function fetchGoogleTasks(tokens: GoogleTokens, max = 20): Promise<Task[]> {
  const { res: listsRes } = await googleFetch(
    tokens,
    `${TASKS_BASE}/users/@me/tasklists?maxResults=5`,
  );
  if (!listsRes.ok) throw new Error(`Tasks list lists failed: ${listsRes.status}`);
  const lists = (await listsRes.json()) as GoogleTaskListResponse;
  const listIds = (lists.items ?? []).map((l) => l.id).slice(0, 3);

  const tasks: Task[] = [];
  for (const listId of listIds) {
    const params = new URLSearchParams({
      maxResults: "20",
      showCompleted: "false",
      showHidden: "false",
    });
    const { res } = await googleFetch(tokens, `${TASKS_BASE}/lists/${listId}/tasks?${params}`);
    if (!res.ok) continue;
    const data = (await res.json()) as { items?: GoogleTaskResponse[] };
    for (const t of data.items ?? []) {
      if (!t.title) continue;
      const due = dueLabel(t.due);
      tasks.push({
        id: `gtask-${t.id}`,
        title: t.title,
        due,
        urgency: due === "Overdue" ? "critical" : due === "Today" ? "high" : "normal",
        done: t.status === "completed",
      });
      if (tasks.length >= max) return tasks;
    }
  }
  return tasks;
}

interface DriveFileResponse {
  id: string;
  name?: string;
  mimeType?: string;
  description?: string;
  modifiedTime?: string;
  size?: string;
}

function driveKind(mime: string): BrainFile["kind"] {
  if (mime === "application/pdf") return "pdf";
  if (/spreadsheet|excel|csv|sheet/.test(mime)) return "sheet";
  if (/document|msword|officedocument|word/.test(mime)) return "doc";
  if (/image\//.test(mime)) return "image";
  if (/markdown|text\/plain/.test(mime)) return "notes";
  return "design";
}

const DRIVE_FOLDER: Record<BrainFile["kind"], string> = {
  pdf: "PDFs",
  doc: "Documents",
  sheet: "Spreadsheets",
  image: "Images",
  notes: "Notes",
  design: "Other",
};

function formatSize(bytes: string | undefined): string {
  const n = Number(bytes ?? 0);
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export async function fetchDriveFiles(tokens: GoogleTokens, max = 25): Promise<BrainFile[]> {
  const params = new URLSearchParams({
    q: "trashed = false",
    pageSize: String(max),
    orderBy: "modifiedTime desc",
    fields: "files(id,name,mimeType,description,modifiedTime,size)",
  });
  const { res } = await googleFetch(tokens, `${DRIVE_BASE}/files?${params}`);
  if (!res.ok) throw new Error(`Drive list failed: ${res.status}`);
  const data = (await res.json()) as { files?: DriveFileResponse[] };

  return (data.files ?? []).map((f) => {
    const kind = driveKind(f.mimeType ?? "");
    const modified = f.modifiedTime
      ? new Date(f.modifiedTime).toLocaleDateString([], { month: "short", day: "numeric" })
      : "";
    const description = f.description?.trim() ?? "";
    return {
      id: `gdrive-${f.id}`,
      name: f.name ?? "(untitled)",
      folder: DRIVE_FOLDER[kind],
      kind,
      size: formatSize(f.size),
      summary:
        description ||
        `Indexed from Google Drive${modified ? `, modified ${modified}` : ""}. No description on the file.`,
      excerpt: description,
      tags: ["drive"],
    } satisfies BrainFile;
  });
}

export function mergeSyncedTasks(existing: Task[], incoming: Task[]): Task[] {
  return [...incoming, ...existing.filter((t) => t.fromCheckin)];
}

export async function ensureFreshTokens(
  userId: number,
  tokens: GoogleTokens,
  save: (userId: number, tokens: GoogleTokens) => void,
): Promise<GoogleTokens> {
  if (tokens.expiresAt > Date.now() + 60_000) return tokens;
  if (!tokens.refreshToken) return tokens;
  const fresh = await refreshTokens(tokens.refreshToken);
  save(userId, { ...fresh, refreshToken: fresh.refreshToken ?? tokens.refreshToken });
  return { ...fresh, refreshToken: fresh.refreshToken ?? tokens.refreshToken };
}

export type SyncOutcome =
  | { connected: false }
  | { connected: true; state: PersistedState; updated: string[] };

export async function syncGoogleIntoState(userId: number): Promise<SyncOutcome> {
  const tokens = loadGoogleTokens(userId);
  if (!tokens) return { connected: false };
  const fresh = await ensureFreshTokens(userId, tokens, saveGoogleTokens);
  const state = getOrCreateUserState(userId);

  const [mails, events, tasks, files] = await Promise.allSettled([
    fetchGmailInbox(fresh),
    fetchCalendarToday(fresh),
    fetchGoogleTasks(fresh),
    fetchDriveFiles(fresh),
  ]);

  const next: PersistedState = { ...state };
  const updated: string[] = [];
  if (mails.status === "fulfilled") {
    next.mails = mails.value;
    updated.push("mails");
  }
  if (events.status === "fulfilled") {
    next.events = events.value;
    updated.push("events");
  }
  if (tasks.status === "fulfilled") {
    next.tasks = mergeSyncedTasks(state.tasks, tasks.value);
    updated.push("tasks");
  }
  if (files.status === "fulfilled") {
    next.files = files.value;
    updated.push("files");
  }

  saveUserState(userId, next);
  return { connected: true, state: next, updated };
}
