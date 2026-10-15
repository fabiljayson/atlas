export type Urgency = "critical" | "high" | "normal" | "low";

export type NotificationKind = "checkin" | "chief" | "files" | "content" | "objective";

export interface Mail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  urgency: Urgency;
  unread: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  urgency: Urgency;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  urgency: Urgency;
  done: boolean;
  project?: string;
  fromCheckin?: boolean;
}

export interface CheckIn {
  id: string;
  day: string;
  worked: string;
  stuck: string;
  tomorrow: string;
}

export interface Objective {
  id: string;
  title: string;
  why: string;
  deadline: string;
  keyResults: { id: string; label: string; done: boolean }[];
}

export interface BrainFile {
  id: string;
  name: string;
  folder: string;
  kind: "pdf" | "doc" | "sheet" | "image" | "notes" | "design";
  size: string;
  summary: string;
  excerpt: string;
  tags: string[];
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "chief";
  text: string;
  sources?: string[];
}

export interface ContentDraft {
  id: string;
  kind: "post" | "newsletter";
  style: "editorial" | "signal" | "minimal";
  kicker: string;
  headline: string;
  body: string;
}

export interface PersistedState {
  mails: Mail[];
  events: CalendarEvent[];
  tasks: Task[];
  objectives: Objective[];
  files: BrainFile[];
  checkins: CheckIn[];
  notifications: AppNotification[];
  chat: ChatMessage[];
  drafts: ContentDraft[];
}

export type PersistedSlice = keyof PersistedState;

export const PERSISTED_SLICES: PersistedSlice[] = [
  "mails",
  "events",
  "tasks",
  "objectives",
  "files",
  "checkins",
  "notifications",
  "chat",
  "drafts",
];
