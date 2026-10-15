"use client";

import { sectionTitle } from "./shared";

const PROBLEMS = [
  {
    title: "Scattered information",
    body: "Your day is split across tasks, files, conversations, and calendars.",
  },
  {
    title: "Constant prioritization",
    body: "Everything feels urgent when nothing gives you the full picture.",
  },
  {
    title: "Lost momentum",
    body: "Without reflection and direction, tomorrow becomes a repeat of today.",
  },
] as const;

export function Problem() {
  return (
    <section id="product" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="max-w-[62ch]">
          <h2 className={sectionTitle}>
            Your work is everywhere. Your focus shouldn&apos;t be.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-dim">
            Important tasks hide in messages. Meetings compete with deadlines. Useful
            information disappears into folders. And the bigger goals get pushed to
            tomorrow.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="bg-panel p-6">
              <h3 className="text-[14.5px] font-medium text-ink">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[12px] tracking-wide text-indigo-soft">
          Atlas brings everything into perspective.
        </p>
      </div>
    </section>
  );
}
