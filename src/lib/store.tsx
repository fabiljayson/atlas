"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CHECKINS,
  EVENTS,
  FILES,
  MAILS,
  NOTIFICATIONS,
  OBJECTIVES,
  TASKS,
  WELCOME_CHAT,
} from "./data";
import { getChiefReply, makeMessage } from "./chief";
import type {
  AppNotification,
  BrainFile,
  CalendarEvent,
  CheckIn,
  ChatMessage,
  ContentDraft,
  Mail,
  Objective,
  PersistedState,
  Task,
} from "./types";

interface SyncResult {
  ok: boolean;
  disconnected?: boolean;
  message?: string;
}

interface Store {
  mails: Mail[];
  events: CalendarEvent[];
  tasks: Task[];
  objectives: Objective[];
  files: BrainFile[];
  checkins: CheckIn[];
  notifications: AppNotification[];
  chat: ChatMessage[];
  drafts: ContentDraft[];
  checkinOpen: boolean;
  chatThinking: boolean;
  googleConnected: boolean;
  openCheckin: () => void;
  closeCheckin: () => void;
  submitCheckin: (input: { worked: string; stuck: string; tomorrow: string }) => void;
  toggleTask: (id: string) => void;
  markMailRead: (id: string) => void;
  syncGoogle: () => Promise<SyncResult>;
  disconnectGoogle: () => Promise<void>;
  markAllNotificationsRead: () => void;
  pushNotification: (n: Omit<AppNotification, "id" | "read" | "time">) => void;
  addObjective: (input: {
    title: string;
    why: string;
    deadline: string;
    keyResults: string[];
  }) => void;
  toggleKeyResult: (objectiveId: string, keyResultId: string) => void;
  arrangeInbox: () => Promise<void>;
  sendChat: (text: string) => Promise<void>;
  generateDraft: (input: {
    kind: "post" | "newsletter";
    style: ContentDraft["style"];
    topic: string;
  }) => void;
}

const StoreContext = createContext<Store | null>(null);

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function StoreProvider({
  children,
  initialState,
  googleConnected: googleConnectedInitial = false,
}: {
  children: ReactNode;
  initialState?: PersistedState;
  googleConnected?: boolean;
}) {
  const [mails, setMails] = useState<Mail[]>(initialState?.mails ?? MAILS);
  const [events, setEvents] = useState<CalendarEvent[]>(initialState?.events ?? EVENTS);
  const [tasks, setTasks] = useState<Task[]>(initialState?.tasks ?? TASKS);
  const [objectives, setObjectives] = useState<Objective[]>(
    initialState?.objectives ?? OBJECTIVES,
  );
  const [files, setFiles] = useState<BrainFile[]>(initialState?.files ?? FILES);
  const [checkins, setCheckins] = useState<CheckIn[]>(initialState?.checkins ?? CHECKINS);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    initialState?.notifications ?? NOTIFICATIONS,
  );
  const [chat, setChat] = useState<ChatMessage[]>(initialState?.chat ?? WELCOME_CHAT);
  const [drafts, setDrafts] = useState<ContentDraft[]>(initialState?.drafts ?? []);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [chatThinking, setChatThinking] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(googleConnectedInitial);

  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const state: PersistedState = {
        mails,
        events,
        tasks,
        objectives,
        files,
        checkins,
        notifications,
        chat,
        drafts,
      };
      void fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      }).catch(() => undefined);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [mails, events, tasks, objectives, files, checkins, notifications, chat, drafts]);

  const pushNotification = useCallback(
    (n: Omit<AppNotification, "id" | "read" | "time">) => {
      setNotifications((prev) => [
        { ...n, id: `n-${Date.now()}`, read: false, time: nowLabel() },
        ...prev,
      ]);
    },
    [],
  );

  const openCheckin = useCallback(() => setCheckinOpen(true), []);
  const closeCheckin = useCallback(() => setCheckinOpen(false), []);

  const submitCheckin = useCallback(
    ({ worked, stuck, tomorrow }: { worked: string; stuck: string; tomorrow: string }) => {
      setCheckins((prev) => [
        {
          id: `c-${Date.now()}`,
          day: "Today",
          worked,
          stuck,
          tomorrow,
        },
        ...prev,
      ]);
      if (tomorrow.trim()) {
        setTasks((prev) => [
          {
            id: `t-${Date.now()}`,
            title: tomorrow.trim(),
            due: "Tomorrow",
            urgency: "high",
            done: false,
            fromCheckin: true,
          },
          ...prev,
        ]);
      }
      pushNotification({
        kind: "checkin",
        title: "Check-in saved",
        body: "Tomorrow's plan is on your dashboard as a task.",
      });
      setCheckinOpen(false);
    },
    [pushNotification],
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const markMailRead = useCallback((id: string) => {
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  }, []);

  const syncGoogle = useCallback(async (): Promise<SyncResult> => {
    try {
      const res = await fetch("/api/sync");
      if (res.status === 401) return { ok: false, message: "Session expired. Sign in again." };
      const data = (await res.json()) as {
        connected?: boolean;
        mails?: Mail[];
        events?: CalendarEvent[];
        error?: string;
      };
      if (!res.ok) return { ok: false, message: data.error ?? "Sync failed. Try again shortly." };
      if (!data.connected) return { ok: false, disconnected: true };
      setMails(data.mails ?? []);
      setEvents(data.events ?? []);
      return { ok: true };
    } catch {
      return { ok: false, message: "Sync failed. Check your connection." };
    }
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addObjective = useCallback<Store["addObjective"]>(
    ({ title, why, deadline, keyResults }) => {
      setObjectives((prev) => [
        {
          id: `o-${Date.now()}`,
          title,
          why,
          deadline,
          keyResults: keyResults.map((label, i) => ({
            id: `k${i + 1}`,
            label,
            done: false,
          })),
        },
        ...prev,
      ]);
      pushNotification({
        kind: "objective",
        title: "New objective",
        body: title,
      });
    },
    [pushNotification],
  );

  const toggleKeyResult = useCallback((objectiveId: string, keyResultId: string) => {
    setObjectives((prev) =>
      prev.map((o) =>
        o.id !== objectiveId
          ? o
          : {
              ...o,
              keyResults: o.keyResults.map((k) =>
                k.id === keyResultId ? { ...k, done: !k.done } : k,
              ),
            },
      ),
    );
  }, []);

  const arrangeInbox = useCallback(async () => {
    const mapping: Record<string, string> = {
      "scan-001.pdf": "Finance",
      "img_2210.png": "Brand",
      "doc-tax-draft.pdf": "Finance",
      "offsite-agenda.md": "Notes",
    };
    for (const [name, folder] of Object.entries(mapping)) {
      await new Promise((r) => setTimeout(r, 450));
      setFiles((prev) =>
        prev.map((f) =>
          f.name === name
            ? { ...f, folder, tags: f.tags.filter((t) => t !== "unsorted") }
            : f,
        ),
      );
    }
    pushNotification({
      kind: "files",
      title: "Files arranged",
      body: "4 files filed into Finance, Brand and Notes.",
    });
  }, [pushNotification]);

  const sendChat = useCallback(
    async (text: string) => {
      setChat((prev) => [...prev, makeMessage("user", text)]);
      setChatThinking(true);
      try {
        const res = await fetch("/api/chief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            ctx: { tasks, objectives, files },
          }),
        });
        const data = (await res.json()) as { text?: string; sources?: string[] };
        if (!res.ok || !data.text) throw new Error("chief failed");
        setChat((prev) => [...prev, makeMessage("chief", data.text!, data.sources)]);
      } catch {
        const reply = getChiefReply(text, { tasks, objectives, files });
        setChat((prev) => [...prev, makeMessage("chief", reply.text, reply.sources)]);
      } finally {
        setChatThinking(false);
      }
    },
    [tasks, objectives, files],
  );

  const generateDraft = useCallback<Store["generateDraft"]>(
    ({ kind, style, topic }) => {
      const clean = topic.trim() || "A quiet update from the studio";
      const headline =
        kind === "newsletter"
          ? clean.length > 60
            ? clean
            : `This week: ${clean}`
          : clean;
      const body =
        style === "signal"
          ? "Built it, used it, kept what worked. The rest went in the bin."
          : style === "editorial"
            ? "Every week I strip the workflow back to one question: what actually moved the work forward? This is what stayed."
            : "Short version: less tooling, more focus. Details inside.";
      setDrafts([
        {
          id: `d-${Date.now()}`,
          kind,
          style,
          kicker: kind === "newsletter" ? "Newsletter" : "Social",
          headline,
          body,
        },
      ]);
      pushNotification({
        kind: "content",
        title: "Draft generated",
        body: `${kind === "newsletter" ? "Newsletter" : "Post"} styled and ready in the Studio.`,
      });
    },
    [pushNotification],
  );

  const value = useMemo<Store>(
    () => ({
      mails,
      events,
      tasks,
      objectives,
      files,
      checkins,
      notifications,
      chat,
      drafts,
      checkinOpen,
      chatThinking,
      openCheckin,
      closeCheckin,
      submitCheckin,
      toggleTask,
      markMailRead,
      syncGoogle,
      markAllNotificationsRead,
      pushNotification,
      addObjective,
      toggleKeyResult,
      arrangeInbox,
      sendChat,
      generateDraft,
    }),
    [
      mails,
      events,
      tasks,
      objectives,
      files,
      checkins,
      notifications,
      chat,
      drafts,
      checkinOpen,
      chatThinking,
      openCheckin,
      closeCheckin,
      submitCheckin,
      toggleTask,
      markMailRead,
      syncGoogle,
      markAllNotificationsRead,
      pushNotification,
      addObjective,
      toggleKeyResult,
      arrangeInbox,
      sendChat,
      generateDraft,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
