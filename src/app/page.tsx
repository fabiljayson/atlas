"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChatCircleDots, FolderSimple, MagicWand, Target } from "@phosphor-icons/react";
import { UrgencyBadge, cn } from "@/components/ui";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  const reduce = useReducedMotion();

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-deep text-[13px] font-semibold text-white">
              A
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-ink">Atlas</span>
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <a href="#features" className="text-[13.5px] text-ink-dim transition-colors hover:text-ink">
              Features
            </a>
            <a href="#ritual" className="text-[13.5px] text-ink-dim transition-colors hover:text-ink">
              The ritual
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-[13.5px] text-ink-dim transition-colors hover:bg-panel-2 hover:text-ink"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-lg bg-indigo-deep px-4 text-[13.5px] font-medium text-white transition-all hover:bg-[#5b53f0] active:translate-y-px"
            >
              Get your Atlas
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pt-20 pb-16 sm:pt-24 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <motion.p
                {...rise(0)}
                className="font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase"
              >
                Mail · Tasks · Files · Goals
              </motion.p>
              <motion.h1
                {...rise(0.07)}
                className="mt-4 text-4xl leading-[1.06] font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
              >
                Run your day before it runs you.
              </motion.h1>
              <motion.p {...rise(0.14)} className="mt-5 max-w-[50ch] text-base leading-relaxed text-ink-dim">
                Mail, tasks, files and objectives in one calm dashboard, with an AI chief
                of staff reading it all.
              </motion.p>
              <motion.div {...rise(0.21)} className="mt-7 flex items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-indigo-deep px-5 text-sm font-medium text-white transition-all hover:bg-[#5b53f0] active:translate-y-px"
                >
                  Get your Atlas
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center rounded-lg border border-line bg-panel px-5 text-sm font-medium text-ink transition-all hover:border-[#2a3358] hover:bg-panel-2 active:translate-y-px"
                >
                  Log in
                </Link>
              </motion.div>
            </div>

            <motion.div {...rise(0.28)}>
              <LandingPreview />
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <motion.div {...reveal()} className="max-w-[60ch]">
            <p className="font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
              What it does
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
              Five jobs, one desk.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-dim">
              Everything you juggle across tabs, arranged by what matters now.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <motion.article
              {...reveal()}
              className="rounded-2xl border border-line bg-panel p-6 md:col-span-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d1220] text-critical">
                  <ArrowRight size={15} className="-rotate-45" />
                </span>
                <h3 className="text-[15px] font-medium text-ink">Triage by urgency</h3>
              </div>
              <p className="mt-3 max-w-[55ch] text-[14px] leading-relaxed text-ink-dim">
                Mail, tasks and meetings sorted into critical, high, normal and low. A live
                &quot;Now&quot; strip keeps the only things that matter today in front of you.
              </p>
              <div className="mt-5 space-y-2">
                <PreviewRow
                  badge={<UrgencyBadge level="critical" />}
                  title="Answer Mira's clause 7.2 question"
                  meta="10:30"
                />
                <PreviewRow
                  badge={<UrgencyBadge level="high" />}
                  title="Finish Q4 report draft"
                  meta="Today"
                />
                <PreviewRow
                  badge={<UrgencyBadge level="normal" />}
                  title="Review brand deck comments"
                  meta="Thu"
                />
              </div>
            </motion.article>

            <motion.article
              {...reveal(0.08)}
              className="rounded-2xl border border-line bg-panel-2 p-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg text-indigo">
                <FolderSimple size={16} />
              </span>
              <h3 className="mt-3 text-[15px] font-medium text-ink">Second brain</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">
                Drop files in. Atlas files them into folders and answers questions with the
                source cited.
              </p>
              <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-ink-faint">
                <li className="flex justify-between rounded border border-line bg-bg px-2.5 py-1.5">
                  <span>Contracts</span>
                  <span className="text-indigo">2</span>
                </li>
                <li className="flex justify-between rounded border border-line bg-bg px-2.5 py-1.5">
                  <span>Finance</span>
                  <span className="text-indigo">3</span>
                </li>
                <li className="flex justify-between rounded border border-line bg-bg px-2.5 py-1.5">
                  <span>Brand</span>
                  <span className="text-indigo">2</span>
                </li>
              </ul>
            </motion.article>

            <motion.article {...reveal(0.04)} className="rounded-2xl bg-indigo-deep p-6 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <MagicWand size={16} />
              </span>
              <h3 className="mt-3 text-[15px] font-medium">Content studio</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/80">
                Your logo, colors and voice. Posts and newsletters styled to your theme in
                one click.
              </p>
              <div className="mt-5 rounded-xl border border-white/20 bg-white/10 p-3">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  Newsletter
                </p>
                <p className="mt-1.5 text-[15px] leading-snug font-medium">
                  A dashboard that reads my files.
                </p>
              </div>
            </motion.article>

            <motion.article
              {...reveal(0.1)}
              className="rounded-2xl border border-line bg-panel p-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161a33] text-indigo">
                <ChatCircleDots size={16} />
              </span>
              <h3 className="mt-3 text-[15px] font-medium text-ink">Chief of staff</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">
                Searches, writes and reads across everything. Ask from the top bar, any
                page.
              </p>
              <div className="mt-4 space-y-2">
                <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-indigo-deep px-3 py-1.5 text-[12.5px] text-white">
                  What&apos;s urgent today?
                </div>
                <div className="w-fit max-w-[90%] rounded-lg rounded-bl-sm border border-line bg-panel-2 px-3 py-1.5 text-[12.5px] text-ink-dim">
                  Two items before 10:30. Here&apos;s the order…
                </div>
              </div>
            </motion.article>

            <motion.article
              {...reveal(0.14)}
              className="rounded-2xl border border-line bg-gradient-to-br from-[#171d3d] to-panel p-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg text-indigo">
                <Target size={16} />
              </span>
              <h3 className="mt-3 text-[15px] font-medium text-ink">Objectives</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">
                Set the direction once. Progress updates as key results land.
              </p>
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[11px] text-ink-faint">
                  <span>Ship the beta</span>
                  <span className="text-indigo">45%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
                  <div className="h-full w-[45%] rounded-full bg-indigo-deep" />
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        <section id="ritual" className="border-y border-line bg-panel/40">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2">
            <motion.div {...reveal()}>
              <div className="rounded-2xl border border-line bg-panel p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-line-soft pb-3">
                  <span className="text-[14px] font-medium text-ink">Evening check-in</span>
                  <span className="font-mono text-[11px] text-ink-faint">18:00</span>
                </div>
                <div className="mt-4 space-y-3">
                  <MockField label="What worked today?" value="Shipped the triage logic." />
                  <MockField label="What stuck?" value="Lost an hour to invoice format." />
                  <MockField label="What's tomorrow?" value="Finish the Q4 draft." />
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="inline-flex h-9 items-center rounded-lg bg-indigo-deep px-4 text-[13px] font-medium text-white">
                    Save check-in
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal(0.1)}>
              <h2 className="text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
                Close the loop every night.
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-dim">
                Two minutes: what worked, what stuck, what tomorrow holds. It lands on your
                dashboard as tasks and notifications before you close the laptop.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo transition-colors hover:text-[#9ba4ff]"
              >
                Start the ritual
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <motion.div {...reveal()} className="mx-auto max-w-[60ch] text-center">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
              It reads what you file.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-dim">
              Contracts, reports, notes. Atlas arranges them into folders, summarizes each
              one, and answers with the exact file cited.
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.1)}
            className="mx-auto mt-10 grid max-w-4xl items-center gap-4 sm:grid-cols-[1fr_auto_1fr]"
          >
            <div className="rounded-2xl border border-line bg-panel p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-urgent uppercase">
                  Inbox
                </span>
                <span className="font-mono text-[11px] text-ink-faint">4 unsorted</span>
              </div>
              <ul className="mt-3 space-y-2 font-mono text-[12px] text-ink-dim">
                <li className="rounded border border-line bg-bg px-3 py-2">scan-001.pdf</li>
                <li className="rounded border border-line bg-bg px-3 py-2">doc-tax-draft.pdf</li>
                <li className="rounded border border-line bg-bg px-3 py-2">offsite-agenda.md</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-indigo">
                <MagicWand size={16} />
              </span>
            </div>
            <div className="rounded-2xl border border-line bg-panel p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-indigo uppercase">
                  Filed
                </span>
                <span className="font-mono text-[11px] text-ink-faint">by topic</span>
              </div>
              <ul className="mt-3 space-y-2 font-mono text-[12px]">
                <li className="flex justify-between rounded border border-line bg-bg px-3 py-2 text-ink-dim">
                  <span>Finance</span>
                  <span className="text-ink-faint">+2</span>
                </li>
                <li className="flex justify-between rounded border border-line bg-bg px-3 py-2 text-ink-dim">
                  <span>Notes</span>
                  <span className="text-ink-faint">+1</span>
                </li>
                <li className="flex justify-between rounded border border-line bg-bg px-3 py-2 text-ink-dim">
                  <span>Brand</span>
                  <span className="text-ink-faint">+1</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-24 text-center">
            <motion.h2
              {...reveal()}
              className="mx-auto max-w-[22ch] text-3xl leading-[1.15] font-semibold tracking-tight text-ink sm:text-5xl"
            >
              A chief of staff, not another chatbot.
            </motion.h2>
            <motion.p {...reveal(0.08)} className="mx-auto mt-5 max-w-[52ch] text-base text-ink-dim">
              It knows your tasks, your files and your objectives, so the answer arrives
              already arranged.
            </motion.p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <motion.div
            {...reveal()}
            className="rounded-3xl border border-line bg-gradient-to-br from-[#171d3d] via-panel to-panel p-10 text-center sm:p-14"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Your Atlas is at hand.
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-[15px] text-ink-dim">
              Set up in two minutes. Keep the calm.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-indigo-deep px-6 text-sm font-medium text-white transition-all hover:bg-[#5b53f0] active:translate-y-px"
              >
                Get your Atlas
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center rounded-lg border border-line bg-bg px-6 text-sm font-medium text-ink transition-all hover:border-[#2a3358] active:translate-y-px"
              >
                Log in
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-deep text-[11px] font-semibold text-white">
              A
            </span>
            <span className="text-[13px] text-ink-dim">Atlas · calm command center</span>
          </div>
          <div className="flex items-center gap-5 text-[13px] text-ink-faint">
            <a href="#features" className="transition-colors hover:text-ink-dim">
              Features
            </a>
            <Link href="/login" className="transition-colors hover:text-ink-dim">
              Log in
            </Link>
            <Link href="/signup" className="transition-colors hover:text-ink-dim">
              Get your Atlas
            </Link>
            <span className="font-mono text-[11px]">© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 border-b border-line bg-panel-2/60 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#2a3358]" />
        <span className="h-2 w-2 rounded-full bg-[#2a3358]" />
        <span className="h-2 w-2 rounded-full bg-[#2a3358]" />
        <span className="ml-2 font-mono text-[10.5px] text-ink-faint">atlas / today</span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
              Wednesday, October 15
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-ink">Good morning.</p>
          </div>
          <div className="flex gap-1.5">
            <MiniStat value="2" label="Critical" tone="text-critical" />
            <MiniStat value="4" label="Events" tone="text-indigo" />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-bg">
          <div className="flex items-center justify-between border-b border-line-soft px-3.5 py-2">
            <span className="text-[12.5px] font-medium text-ink">Now</span>
            <span className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-wider text-critical uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-critical anim-pulse-dot" />
              Live
            </span>
          </div>
          <div className="divide-y divide-line-soft">
            <PreviewRow
              badge={<UrgencyBadge level="critical" />}
              title="Answer Mira's clause 7.2 question"
              meta="Task"
            />
            <PreviewRow
              badge={<UrgencyBadge level="critical" />}
              title="Bright Labs: countersignature requested"
              meta="Mail"
            />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-bg px-3.5 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-ink">Tasks</span>
            <span className="font-mono text-[10px] text-ink-faint">7 open</span>
          </div>
          <ul className="space-y-2">
            {[
              { t: "Answer Mira's clause 7.2 question", done: false },
              { t: "Finish Q4 report draft", done: false },
              { t: "Reply to newsletter sponsor", done: true },
            ].map((task) => (
              <li key={task.t} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                    task.done
                      ? "border-indigo-deep bg-indigo-deep"
                      : "border-line bg-panel",
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
                    "truncate text-[12.5px]",
                    task.done ? "text-ink-faint line-through" : "text-ink-dim",
                  )}
                >
                  {task.t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-2.5 py-1.5">
      <div className={cn("font-mono text-[15px] leading-none", tone)}>{value}</div>
      <div className="mt-1 font-mono text-[8.5px] tracking-wider text-ink-faint uppercase">
        {label}
      </div>
    </div>
  );
}

function PreviewRow({
  badge,
  title,
  meta,
}: {
  badge: React.ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
      <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{title}</span>
      {badge}
      <span className="font-mono text-[10px] text-ink-faint">{meta}</span>
    </div>
  );
}

function MockField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] font-medium text-ink-dim">{label}</div>
      <div className="mt-1 rounded-lg border border-line bg-bg px-3 py-2 text-[13px] text-ink-dim">
        {value}
      </div>
    </div>
  );
}
