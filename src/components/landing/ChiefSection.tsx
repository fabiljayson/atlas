"use client";

import { ChatCircleDots, Sparkle } from "@phosphor-icons/react";
import { sectionTitle } from "./shared";

const PROMPTS = [
  "What should I focus on today?",
  "Help me prepare for my next meeting.",
  "Summarize the key points in my documents.",
  "Turn my objective into actionable tasks.",
] as const;

export function ChiefSection() {
  return (
    <section id="chief" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
            <Sparkle size={17} />
          </span>
          <h2 className={`${sectionTitle} mt-4`}>
            An extra layer of clarity for every decision.
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-dim">
            Your Chief of Staff helps you explore information, organize your thinking,
            draft ideas, and turn intentions into practical next steps.
          </p>
          <p className="mt-6 max-w-[54ch] text-[13.5px] leading-relaxed text-ink-faint">
            Atlas answers through your configured AI provider when one is available, and
            falls back to a deterministic rules engine when it isn&apos;t. It works from
            the tasks, objectives, files and check-ins in your workspace — it is an
            assistant, not an oracle, and it can be wrong.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-card">
          <div className="flex items-center gap-2 border-b border-line bg-panel-2/70 px-4 py-2.5">
            <ChatCircleDots size={14} className="text-indigo-soft" />
            <span className="font-mono text-[10.5px] text-ink-faint">chief of staff</span>
            <span className="ml-auto rounded border border-line bg-bg px-2 py-0.5 font-mono text-[9px] tracking-wider text-ink-faint uppercase">
              Illustrative preview
            </span>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map((p) => (
                <span
                  key={p}
                  className="rounded-lg border border-line bg-bg px-3 py-1.5 text-[12px] text-ink-dim"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-indigo px-3.5 py-2.5 text-[13px] text-white">
              What should I focus on today?
            </div>

            <div className="w-fit max-w-[92%] rounded-lg rounded-bl-sm border border-line bg-bg px-3.5 py-3 text-[13px] leading-relaxed text-ink-dim">
              <p>Here is the order of operations:</p>
              <ol className="mt-2 space-y-1 font-mono text-[12px]">
                <li>
                  <span className="text-critical-ink">1.</span> Answer clause 7.2
                  question — 10:30
                </li>
                <li>
                  <span className="text-critical-ink">2.</span> Countersignature
                  requested — Mail
                </li>
                <li>
                  <span className="text-urgent-ink">3.</span> Finish Q4 report draft —
                  Today
                </li>
              </ol>
              <p className="mt-2 text-ink-faint">The deep work block at 13:30 is free.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
