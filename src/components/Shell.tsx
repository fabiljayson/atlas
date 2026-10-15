"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Brain,
  CalendarBlank,
  Cards,
  MagnifyingGlass,
  SquaresFour,
  Target,
} from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { Button, cn, Modal, Field, inputClass } from "./ui";

const NAV = [
  { href: "/app", label: "Today", icon: SquaresFour },
  { href: "/app/brain", label: "Second brain", icon: Brain },
  { href: "/app/studio", label: "Content studio", icon: Cards },
  { href: "/app/objectives", label: "Objectives", icon: Target },
] as const;

export function Shell({
  children,
  user,
}: {
  children: ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, markAllNotificationsRead, openCheckin } = useStore();
  const [bellOpen, setBellOpen] = useState(false);
  const [search, setSearch] = useState("");
  const bellRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const title =
    NAV.find((n) => n.href === pathname)?.label ?? "Today";

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/app/objectives?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-panel/60 backdrop-blur md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-deep font-display text-[15px] font-semibold text-white">
            A
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-ink">Atlas</div>
            <div className="font-mono text-[10px] tracking-wider text-ink-faint uppercase">
              Chief of staff
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 pt-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-panel-2 text-ink"
                    : "text-ink-dim hover:bg-panel-2/60 hover:text-ink",
                )}
              >
                <Icon size={16} weight={active ? "fill" : "regular"} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line-soft p-3">
          <Button variant="primary" className="w-full" onClick={openCheckin}>
            <CalendarBlank size={15} />
            Evening check-in
          </Button>
          <p className="mt-2 px-1 font-mono text-[10px] leading-relaxed text-ink-faint">
            Daily at 18:00 · 2 min
          </p>
          <div className="mt-3 flex items-center gap-2 border-t border-line-soft px-1 pt-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-panel-2 font-mono text-[11px] text-indigo">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] text-ink">{user.name}</div>
              <button
                onClick={signOut}
                className="font-mono text-[10px] tracking-wider text-ink-faint uppercase transition-colors hover:text-ink-dim"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-60">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-deep text-[13px] font-semibold text-white">
                A
              </span>
            </div>
            <h1 className="hidden text-[15px] font-medium text-ink md:block">{title}</h1>

            <form onSubmit={onSearch} className="ml-auto w-full max-w-xs sm:max-w-sm">
              <div className="relative">
                <MagnifyingGlass
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ask or search anything…"
                  aria-label="Ask or search"
                  className="h-9 w-full rounded-lg border border-line bg-panel pl-8 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-[#35407a] focus:outline-none"
                />
              </div>
            </form>

            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                aria-label="Notifications"
                className="relative rounded-lg p-2 text-ink-dim transition-colors hover:bg-panel-2 hover:text-ink"
              >
                <Bell size={17} />
                {unread > 0 ? (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-critical" />
                ) : null}
              </button>

              {bellOpen ? (
                <div className="anim-fade-up absolute right-0 z-50 mt-2 w-80 rounded-xl border border-line bg-panel shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                    <span className="text-[13px] font-medium text-ink">Notifications</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="font-mono text-[10px] tracking-wide text-indigo uppercase hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={cn(
                          "border-b border-line-soft px-4 py-3 last:border-b-0",
                          !n.read && "bg-panel-2/50",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-medium text-ink">{n.title}</span>
                          <span className="font-mono text-[10px] text-ink-faint">{n.time}</span>
                        </div>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-dim">
                          {n.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-line-soft p-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setBellOpen(false);
                        openCheckin();
                      }}
                    >
                      Start evening check-in
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-line-soft px-3 py-2 md:hidden">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] transition-colors",
                    active ? "bg-panel-2 text-ink" : "text-ink-dim",
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>

      <CheckInModal />
    </div>
  );
}

function CheckInModal() {
  const { checkinOpen, closeCheckin, submitCheckin } = useStore();
  const [worked, setWorked] = useState("");
  const [stuck, setStuck] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  return (
    <Modal
      open={checkinOpen}
      onClose={closeCheckin}
      title="Evening check-in"
      width="max-w-xl"
    >
      <p className="mb-5 text-[13px] leading-relaxed text-ink-dim">
        Two minutes. What worked, what stuck, what tomorrow holds — it lands on your
        dashboard as notifications and tasks.
      </p>
      <div className="space-y-4">
        <Field label="What worked today?">
          <textarea
            className={cn(inputClass, "min-h-[70px] resize-y")}
            value={worked}
            onChange={(e) => setWorked(e.target.value)}
            placeholder="Shipped the triage logic…"
          />
        </Field>
        <Field label="What stuck?">
          <textarea
            className={cn(inputClass, "min-h-[70px] resize-y")}
            value={stuck}
            onChange={(e) => setStuck(e.target.value)}
            placeholder="Lost an hour to invoice formatting…"
          />
        </Field>
        <Field label="What's tomorrow?" hint="Turns into a task on your dashboard.">
          <textarea
            className={cn(inputClass, "min-h-[70px] resize-y")}
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder="Finish the Q4 draft…"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={closeCheckin}>
            Later
          </Button>
          <Button
            variant="primary"
            onClick={() => submitCheckin({ worked, stuck, tomorrow })}
            disabled={!worked.trim() && !stuck.trim() && !tomorrow.trim()}
          >
            Save check-in
          </Button>
        </div>
      </div>
    </Modal>
  );
}
