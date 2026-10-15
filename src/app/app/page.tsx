"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  CalendarBlank,
  CheckSquare,
  EnvelopeSimple,
  Lightning,
  ArrowsClockwise,
  GoogleLogo,
} from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { Button, Panel, PanelHeader, UrgencyBadge, cn } from "@/components/ui";

function useTodayLabel() {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 60_000);
      return () => clearInterval(id);
    },
    () =>
      new Date().toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    () => "",
  );
}

export default function TodayPage() {
  const {
    mails,
    events,
    tasks,
    checkins,
    toggleTask,
    markMailRead,
    openCheckin,
    syncGoogle,
    googleConnected,
    disconnectGoogle,
  } = useStore();

  const [googleState, setGoogleState] = useState<"unknown" | "connected" | "disconnected">(
    googleConnected ? "connected" : "unknown",
  );
  const [syncing, setSyncing] = useState(false);
  const [googleMsg, setGoogleMsg] = useState<string | null>(null);

  const runSync = useCallback(
    async (silent: boolean) => {
      const result = await syncGoogle();
      if (result.ok) {
        setGoogleState("connected");
        if (!silent) setGoogleMsg("Synced just now.");
      } else if (result.disconnected) {
        setGoogleState("disconnected");
      } else if (result.message) {
        setGoogleMsg(result.message);
      }
    },
    [syncGoogle],
  );

  useEffect(() => {
    queueMicrotask(() => void runSync(true));
  }, [runSync]);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("google");
    if (!flag) return;
    window.history.replaceState({}, "", "/app");
    if (flag === "connected") {
      queueMicrotask(() => void runSync(false));
    } else if (flag === "not-configured") {
      queueMicrotask(() => setGoogleMsg("Google is not configured on this server."));
    } else {
      queueMicrotask(() => setGoogleMsg("Google connection failed. Try again."));
    }
  }, [runSync]);

  const openTasks = tasks.filter((t) => !t.done);
  const criticalTasks = openTasks.filter((t) => t.urgency === "critical");
  const unreadCritical = mails.filter((m) => m.unread && m.urgency === "critical");
  const nowItems = [
    ...criticalTasks.map((t) => ({
      id: t.id,
      kind: "Task" as const,
      title: t.title,
      meta: t.due,
      urgency: t.urgency,
    })),
    ...unreadCritical.map((m) => ({
      id: m.id,
      kind: "Mail" as const,
      title: `${m.from}: ${m.subject}`,
      meta: m.time,
      urgency: m.urgency,
    })),
  ];
  const lastCheckin = checkins[0];
  const today = useTodayLabel();

  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">
            {today}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            Good morning.
          </h2>
          <p className="mt-1 max-w-[55ch] text-[13px] text-ink-dim">
            {nowItems.length > 0
              ? `${nowItems.length} critical items need you. Everything else can wait its turn.`
              : "Nothing critical. Protect the deep work block."}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Stat label="Critical" value={String(nowItems.length)} tone="critical" />
            <Stat
              label="Events"
              value={String(events.length)}
              tone="normal"
            />
            <Stat
              label="Open tasks"
              value={String(openTasks.length)}
              tone="neutral"
            />
          </div>
          <div className="flex items-center gap-2">
            {googleState === "connected" ? (
              <>
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                  <GoogleLogo size={12} />
                  Google
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={syncing}
                  onClick={() => {
                    setSyncing(true);
                    setGoogleMsg(null);
                    void runSync(false).finally(() => setSyncing(false));
                  }}
                >
                  <ArrowsClockwise size={13} className={syncing ? "animate-spin" : undefined} />
                  {syncing ? "Syncing" : "Sync"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    void disconnectGoogle().then(() => {
                      setGoogleState("disconnected");
                      setGoogleMsg("Google disconnected.");
                    });
                  }}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <a
                href="/api/google/connect"
                className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-line-strong bg-panel px-3 text-[13px] font-medium text-ink transition-all duration-fast hover:border-indigo hover:bg-panel-2 active:translate-y-px"
              >
                <GoogleLogo size={13} />
                Connect Google
              </a>
            )}
          </div>
          {googleMsg ? (
            <p className="max-w-[36ch] text-right font-mono text-[10px] text-ink-faint">
              {googleMsg}
            </p>
          ) : null}
        </div>
      </div>

      {nowItems.length > 0 ? (
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Now"
            meta="urgent + important"
            action={
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-critical-ink uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-critical anim-pulse-dot" />
                Live
              </span>
            }
          />
          <ul className="divide-y divide-line-soft">
            {nowItems.map((item) => (
              <li
                key={`${item.kind}-${item.id}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <Lightning size={14} className="shrink-0 text-critical" />
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                  {item.title}
                </span>
                <span className="font-mono text-[10px] text-ink-faint uppercase">
                  {item.kind}
                </span>
                <UrgencyBadge level={item.urgency} />
                <span className="w-14 shrink-0 text-right font-mono text-[11px] text-ink-faint">
                  {item.meta}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col">
          <PanelHeader
            title="Mail"
            meta={`${mails.filter((m) => m.unread).length} unread`}
            action={
              <span className="flex items-center gap-1 text-ink-faint">
                <EnvelopeSimple size={13} />
              </span>
            }
          />
          <ul className="divide-y divide-line-soft">
            {mails.length === 0 ? (
              <li className="px-4 py-6 text-[12.5px] text-ink-faint">
                {googleState === "connected"
                  ? "No recent mail in your inbox."
                  : "Connect Google to bring your inbox in."}
              </li>
            ) : (
              mails.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => markMailRead(m.id)}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-panel-2/60"
                  >
                    <div className="flex items-center gap-2">
                      {m.unread ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo" />
                      ) : (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-transparent" />
                      )}
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-[13px]",
                          m.unread ? "font-medium text-ink" : "text-ink-dim",
                        )}
                      >
                        {m.from}
                      </span>
                      <span className="font-mono text-[10px] text-ink-faint">{m.time}</span>
                      <UrgencyBadge level={m.urgency} />
                    </div>
                    <p className="mt-1 pl-4 text-[12.5px] leading-snug text-ink-dim">
                      {m.subject}
                    </p>
                    <p className="mt-1 line-clamp-2 pl-4 text-[12px] leading-relaxed text-ink-faint">
                      {m.preview}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHeader
            title="Today"
            meta="calendar"
            action={
              <span className="flex items-center gap-1 text-ink-faint">
                <CalendarBlank size={13} />
              </span>
            }
          />
          <ul className="divide-y divide-line-soft">
            {events.length === 0 ? (
              <li className="px-4 py-6 text-[12.5px] text-ink-faint">
                {googleState === "connected"
                  ? "Nothing scheduled today."
                  : "Connect Google to see your calendar."}
              </li>
            ) : (
              events.map((e) => (
                <li key={e.id} className="flex gap-3 px-4 py-3">
                  <div className="w-24 shrink-0">
                    <div className="font-mono text-[12px] text-ink">{e.start}</div>
                    <div className="font-mono text-[10px] text-ink-faint">{e.end}</div>
                  </div>
                  <div className="min-w-0 flex-1 border-l border-line pl-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-medium text-ink">{e.title}</span>
                      <UrgencyBadge level={e.urgency} />
                    </div>
                    {e.location ? (
                      <p className="mt-1 font-mono text-[10px] text-ink-faint">
                        {e.location}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader
              title="Tasks"
              meta={`${openTasks.length} open`}
              action={
                <span className="flex items-center gap-1 text-ink-faint">
                  <CheckSquare size={13} />
                </span>
              }
            />
            <ul className="divide-y divide-line-soft">
              {tasks.length === 0 ? (
                <li className="px-4 py-6 text-[12.5px] text-ink-faint">
                  {googleState === "connected"
                    ? "No open tasks. Check-ins add tomorrow's plan here."
                    : "Connect Google to bring in your tasks."}
                </li>
              ) : (
                tasks.map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-panel-2/60">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="h-3.5 w-3.5 shrink-0 accent-indigo"
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-[13px]",
                          t.done ? "text-ink-faint line-through" : "text-ink",
                        )}
                      >
                        {t.title}
                        {t.fromCheckin ? (
                          <span className="ml-2 font-mono text-[9px] tracking-wide text-indigo uppercase">
                            from check-in
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-ink-faint">
                        {t.due}
                      </span>
                      <UrgencyBadge level={t.urgency} />
                    </label>
                  </li>
                ))
              )}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Evening check-in" meta="18:00" />
            <div className="px-4 py-4">
              {lastCheckin ? (
                <div className="space-y-2 text-[12.5px] leading-relaxed">
                  <Line label="Worked" value={lastCheckin.worked} />
                  <Line label="Stuck" value={lastCheckin.stuck} />
                  <Line label="Tomorrow" value={lastCheckin.tomorrow} />
                </div>
              ) : (
                <p className="text-[12.5px] text-ink-dim">No check-in yet today.</p>
              )}
              <Button variant="primary" size="sm" className="mt-3" onClick={openCheckin}>
                {lastCheckin?.day === "Today" ? "Update check-in" : "Start check-in"}
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "critical" | "normal" | "neutral";
}) {
  return (
    <div className="min-w-[92px] rounded-lg border border-line bg-panel px-3 py-2">
      <div
        className={cn(
          "font-mono text-lg leading-none",
          tone === "critical" && "text-critical-ink",
          tone === "normal" && "text-indigo",
          tone === "neutral" && "text-ink",
        )}
      >
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
        {label}
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[10px] tracking-wider text-ink-faint uppercase">
        {label}
      </span>
      <p className="text-ink-dim">{value}</p>
    </div>
  );
}
