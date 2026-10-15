import type { CalendarEvent, Mail, Urgency } from "./types";
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
].join(" ");

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";
const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";

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

export async function syncGoogleIntoState(
  userId: number,
): Promise<{ connected: false } | { connected: true; mails: Mail[]; events: CalendarEvent[] }> {
  const tokens = loadGoogleTokens(userId);
  if (!tokens) return { connected: false };
  const fresh = await ensureFreshTokens(userId, tokens, saveGoogleTokens);
  const [mails, events] = await Promise.all([
    fetchGmailInbox(fresh),
    fetchCalendarToday(fresh),
  ]);
  const state = getOrCreateUserState(userId);
  saveUserState(userId, { ...state, mails, events });
  return { connected: true, mails, events };
}
