"use client";

import {
  ChatCircleDots,
  CheckSquare,
  FolderSimple,
  MagicWand,
  SquaresFour,
} from "@phosphor-icons/react";
import { UrgencyBadge, cn } from "@/components/ui";
import { sectionTitle } from "./shared";

export function Pillars() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <div className="max-w-[62ch]">
        <h2 className={sectionTitle}>Everything you need. Nothing you don&apos;t.</h2>
        <p className="mt-4 text-base leading-relaxed text-ink-dim">
          Atlas connects the moving parts of your day and helps you turn information
          into action.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        <article className="grid items-center gap-6 rounded-xl border border-line bg-panel p-6 md:grid-cols-2 lg:p-8">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
              <SquaresFour size={17} />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              Today — Know what matters now
            </h3>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-dim">
              Bring your tasks, schedule, and priorities into one clear view. Atlas
              organizes work by urgency so you can see what needs attention first.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-ink-faint">
              <li>Critical · high · normal · low urgency</li>
              <li>Upcoming events in one timeline</li>
              <li>A live &quot;Now&quot; strip for today</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-bg p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider text-critical-ink uppercase">
                Now
              </span>
              <span className="font-mono text-[10px] text-ink-faint">2 critical</span>
            </div>
            <ul className="space-y-2.5">
              {[
                { t: "Answer clause 7.2 question", u: "critical" as const, m: "10:30" },
                { t: "Countersignature requested", u: "critical" as const, m: "Mail" },
                { t: "Finish Q4 report draft", u: "high" as const, m: "Today" },
                { t: "Review brand deck comments", u: "normal" as const, m: "Thu" },
              ].map((row) => (
                <li
                  key={row.t}
                  className="flex items-center gap-3 rounded border border-line bg-panel px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-dim">
                    {row.t}
                  </span>
                  <UrgencyBadge level={row.u} />
                  <span className="font-mono text-[10px] text-ink-faint">{row.m}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="grid items-center gap-6 rounded-xl border border-line bg-panel p-6 md:grid-cols-2 lg:p-8">
          <div className="order-2 md:order-1">
            <div className="rounded-lg border border-line bg-bg p-4">
              <ul className="space-y-2.5">
                {[
                  { n: "Q4-report.pdf", s: "Quarterly results, risks and the hiring plan…" },
                  { n: "brand-guide.md", s: "Voice rules: calm, direct, no hype…" },
                  { n: "tax-draft.pdf", s: "Deductions summary with two open questions…" },
                ].map((f) => (
                  <li key={f.n} className="rounded border border-line bg-panel px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-mono text-[11.5px] text-ink">
                        {f.n}
                      </span>
                      <span className="font-mono text-[9.5px] tracking-wider text-ink-faint uppercase">
                        summary
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11.5px] text-ink-faint">{f.s}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
              <FolderSimple size={17} />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              Second Brain — Remember everything
            </h3>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-dim">
              Turn your files into searchable knowledge. Explore summaries, discover
              relevant excerpts, and ask questions grounded in your stored documents.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-ink-faint">
              <li>Organized file collections</li>
              <li>Summaries and excerpts per file</li>
              <li>Document Q&amp;A that cites its source</li>
            </ul>
          </div>
        </article>

        <article className="grid items-center gap-6 rounded-xl border border-line bg-panel p-6 md:grid-cols-2 lg:p-8">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
              <ChatCircleDots size={17} />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              AI Chief of Staff — Think beyond the task list
            </h3>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-dim">
              Get help searching your workspace, drafting content, reviewing priorities,
              and turning scattered information into actionable next steps.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-ink-faint">
              <li>A conversational assistant in every section</li>
              <li>Suggested prompts to start from</li>
              <li>Clear responses with the next action</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-bg p-4">
            <div className="space-y-2.5">
              <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-indigo px-3 py-2 text-[12.5px] text-white">
                What should I focus on today?
              </div>
              <div className="w-fit max-w-[92%] rounded-lg rounded-bl-sm border border-line bg-panel px-3 py-2 text-[12.5px] leading-relaxed text-ink-dim">
                Two critical items before 10:30, then the Q4 draft. Your calendar has a
                free block at 13:30 — I&apos;d protect it for deep work.
              </div>
              <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-indigo px-3 py-2 text-[12.5px] text-white">
                Turn the Q4 draft into tasks.
              </div>
            </div>
          </div>
        </article>

        <article className="grid items-center gap-6 rounded-xl border border-line bg-panel p-6 md:grid-cols-2 lg:p-8">
          <div className="order-2 md:order-1">
            <div className="rounded-lg border border-line bg-bg p-4">
              <div className="rounded-lg border border-line bg-panel px-3.5 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9.5px] tracking-wider text-ink-faint uppercase">
                    Newsletter draft
                  </span>
                  <span className="font-mono text-[9.5px] text-indigo-soft">signal</span>
                </div>
                <p className="mt-2 text-[14px] leading-snug font-medium text-ink">
                  This week: less tooling, more focus
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-dim">
                  Built it, used it, kept what worked. The rest went in the bin.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] text-ink-faint">
                <span className="rounded border border-line bg-panel px-2 py-1">
                  indigo #5d60ee
                </span>
                <span className="rounded border border-line bg-panel px-2 py-1">Geist</span>
                <span className="rounded border border-line bg-panel px-2 py-1">
                  JetBrains Mono
                </span>
                <span className="rounded border border-line bg-panel px-2 py-1">
                  calm voice
                </span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
              <MagicWand size={17} />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              Content Studio — Create in your voice
            </h3>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-dim">
              Develop posts and newsletters that reflect your voice and visual identity,
              with content designed to fit your brand.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-ink-faint">
              <li>Drafts as posts or newsletters</li>
              <li>Brand colors and typography built in</li>
              <li>Three card styles, one click each</li>
            </ul>
          </div>
        </article>

        <article className="grid items-center gap-6 rounded-xl border border-line bg-panel p-6 md:grid-cols-2 lg:p-8">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
              <CheckSquare size={17} />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              Objectives and Evening Check-ins — Make progress intentional
            </h3>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-dim">
              Track the outcomes that matter, review what worked, recognize what got in
              the way, and prepare for a more focused tomorrow.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-ink-faint">
              <li>Objectives with key-result progress</li>
              <li>Evening reflection prompts</li>
              <li>Follow-up tasks and notifications</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-bg p-4">
            <div className="rounded-lg border border-line bg-panel px-3.5 py-3">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-ink-dim">Ship the beta to 10 testers</span>
                <span className="text-indigo-soft">45%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
                <div className="h-full w-[45%] rounded-full bg-indigo" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { q: "What went well today?", a: "Shipped the triage logic." },
                { q: "What needs more attention?", a: "Invoice formatting." },
                { q: "Most important thing for tomorrow?", a: "Finish the Q4 draft." },
              ].map((r) => (
                <div
                  key={r.q}
                  className={cn(
                    "rounded border border-line bg-panel px-3 py-2",
                    "flex items-baseline justify-between gap-3",
                  )}
                >
                  <span className="text-[11.5px] text-ink-faint">{r.q}</span>
                  <span className="truncate text-[11.5px] text-ink-dim">{r.a}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
