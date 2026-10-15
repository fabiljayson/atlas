"use client";

import { sectionTitle } from "./shared";

const PROMPTS = [
  { q: "What went well today?", a: "Shipped the triage logic." },
  { q: "What needs more attention?", a: "Invoice formatting took too long." },
  { q: "Most important thing for tomorrow?", a: "Finish the Q4 draft." },
] as const;

export function Evening() {
  return (
    <section id="ritual" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className={sectionTitle}>
            Close the day with clarity. Start tomorrow with direction.
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-dim">
            Take a moment to review what moved forward, what held you back, and what
            deserves your attention next.
          </p>
          <p className="mt-6 max-w-[54ch] text-[13.5px] leading-relaxed text-ink-faint">
            Reflections are saved to your check-in history, and tomorrow&apos;s plan
            lands back on your dashboard as a task and a notification.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-panel p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between border-b border-line-soft pb-3">
            <span className="text-[14px] font-medium text-ink">Evening check-in</span>
            <span className="font-mono text-[11px] text-ink-faint">18:00 · 2 min</span>
          </div>
          <div className="mt-5 space-y-4">
            {PROMPTS.map((p) => (
              <div key={p.q}>
                <div className="font-mono text-[10.5px] tracking-wider text-indigo-soft uppercase">
                  {p.q}
                </div>
                <div className="mt-1.5 rounded-lg border border-line bg-bg px-3.5 py-2.5 text-[13px] text-ink-dim">
                  {p.a}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <span className="inline-flex h-9 items-center rounded-lg bg-indigo px-4 text-[13px] font-medium text-white">
              Save check-in
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
