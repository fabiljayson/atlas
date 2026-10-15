"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChatCircleDots, FolderSimple, Target } from "@phosphor-icons/react";
import { UrgencyBadge, cn } from "@/components/ui";
import { primaryCta, secondaryCta, useHeroRise } from "./shared";

export function Hero() {
  const rise = useHeroRise();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-14 pb-16 lg:pt-24 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
        <div>
          <motion.p
            {...rise(0)}
            className="font-mono text-[11px] tracking-[0.22em] text-indigo-soft uppercase"
          >
            Personal productivity, reimagined
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.35rem]"
          >
            Your entire workday. Finally, in focus.
          </motion.h1>
          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-[54ch] text-base leading-relaxed text-ink-dim"
          >
            Atlas brings your tasks, calendar, files, goals, and ideas into one
            intelligent workspace — so you can stop juggling everything and start
            focusing on what matters.
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup" className={primaryCta}>
              Enter your command center
              <ArrowRight size={15} />
            </Link>
            <a href="#product" className={secondaryCta}>
              Explore Atlas
            </a>
          </motion.div>
          <motion.p {...rise(0.3)} className="mt-6 font-mono text-[11.5px] text-ink-faint">
            One workspace. A clearer mind. A better day.
          </motion.p>
        </div>

        <motion.div {...rise(0.2)} aria-hidden>
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-popover">
      <div className="flex items-center gap-2 border-b border-line bg-panel-2/70 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-line-strong/60" />
        <span className="h-2 w-2 rounded-full bg-line-strong/60" />
        <span className="h-2 w-2 rounded-full bg-line-strong/60" />
        <span className="ml-2 font-mono text-[10.5px] text-ink-faint">atlas / today</span>
        <span className="ml-auto rounded border border-line bg-bg px-2 py-0.5 font-mono text-[9px] tracking-wider text-ink-faint uppercase">
          Illustrative preview
        </span>
      </div>

      <div className="space-y-3.5 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
              Wednesday, October 15
            </p>
            <p className="mt-1 text-[15px] font-semibold text-ink">Good morning.</p>
          </div>
          <div className="flex gap-2">
            <MiniStat value="2" label="Critical" tone="text-critical-ink" />
            <MiniStat value="4" label="Events" tone="text-indigo-soft" />
          </div>
        </div>

        <div className="rounded-lg border border-line bg-bg">
          <div className="flex items-center justify-between border-b border-line-soft px-3.5 py-2">
            <span className="text-[12.5px] font-medium text-ink">Now</span>
            <span className="flex items-center gap-2 font-mono text-[9.5px] tracking-wider text-critical-ink uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-critical anim-pulse-dot" />
              Live
            </span>
          </div>
          <div className="divide-y divide-line-soft">
            <Row
              badge={<UrgencyBadge level="critical" />}
              title="Answer clause 7.2 question"
              meta="Task · 10:30"
            />
            <Row
              badge={<UrgencyBadge level="critical" />}
              title="Countersignature requested"
              meta="Mail"
            />
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-bg p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-ink">Tasks</span>
              <span className="font-mono text-[10px] text-ink-faint">7 open</span>
            </div>
            <ul className="space-y-2">
              {[
                { t: "Answer clause 7.2 question", done: false, due: "10:30" },
                { t: "Finish Q4 report draft", done: false, due: "Today" },
                { t: "Reply to newsletter sponsor", done: true, due: "Done" },
              ].map((task) => (
                <li key={task.t} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                      task.done ? "border-indigo bg-indigo" : "border-line-strong bg-panel",
                    )}
                  >
                    {task.done ? (
                      <svg viewBox="0 0 10 10" className="h-2 w-2">
                        <path
                          d="M1.5 5 L4 7.5 L8.5 2.5"
                          stroke="white"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[12.5px]",
                      task.done ? "text-ink-faint line-through" : "text-ink-dim",
                    )}
                  >
                    {task.t}
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint">{task.due}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3.5">
            <div className="rounded-lg border border-line bg-bg p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-ink">Today</span>
                <span className="font-mono text-[10px] text-ink-faint">calendar</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  { time: "11:00", title: "Design sync", len: "30 min" },
                  { time: "13:30", title: "Deep work block", len: "2 hr" },
                  { time: "16:00", title: "Weekly review", len: "45 min" },
                ].map((e) => (
                  <li key={e.time} className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-faint">{e.time}</span>
                    <span className="h-6 w-px bg-line" />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-dim">
                      {e.title}
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">{e.len}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-line bg-bg p-3.5">
              <div className="mb-2.5 flex items-center gap-2">
                <ChatCircleDots size={13} className="text-indigo-soft" />
                <span className="text-[12.5px] font-medium text-ink">Chief of staff</span>
              </div>
              <div className="space-y-2">
                <div className="ml-auto w-fit max-w-[88%] rounded-lg rounded-br-sm bg-indigo px-2.5 py-1.5 text-[12px] text-white">
                  What should I focus on today?
                </div>
                <div className="w-fit max-w-[92%] rounded-lg rounded-bl-sm border border-line bg-panel px-2.5 py-1.5 text-[12px] leading-relaxed text-ink-dim">
                  Two critical items before 10:30. Answer the clause question first, then
                  the countersignature.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-bg p-3.5">
            <div className="mb-2.5 flex items-center gap-2">
              <Target size={13} className="text-indigo-soft" />
              <span className="text-[12.5px] font-medium text-ink">Objective</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-ink-dim">Ship the beta to 10 testers</span>
              <span className="text-indigo-soft">45%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel">
              <div className="h-full w-[45%] rounded-full bg-indigo" />
            </div>
          </div>

          <div className="hidden rounded-lg border border-line bg-bg p-3.5 sm:block">
            <div className="mb-2.5 flex items-center gap-2">
              <FolderSimple size={13} className="text-indigo-soft" />
              <span className="text-[12.5px] font-medium text-ink">Second brain</span>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-ink-dim">
              <li className="flex items-center justify-between">
                <span className="truncate">Q4-report.pdf</span>
                <span className="text-ink-faint">summary</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="truncate">brand-guide.md</span>
                <span className="text-ink-faint">excerpt</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-3 py-2">
      <div className={cn("font-mono text-[15px] leading-none", tone)}>{value}</div>
      <div className="mt-1 font-mono text-[8.5px] tracking-wider text-ink-faint uppercase">
        {label}
      </div>
    </div>
  );
}

function Row({
  badge,
  title,
  meta,
}: {
  badge: React.ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5">
      <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{title}</span>
      {badge}
      <span className="font-mono text-[10px] text-ink-faint">{meta}</span>
    </div>
  );
}
