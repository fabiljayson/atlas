"use client";

import { ArrowRight, Eye, StackSimple } from "@phosphor-icons/react";
import { sectionTitle } from "./shared";

const STEPS = [
  {
    n: "1",
    title: "Gather",
    body: "Bring your work, plans, documents, and objectives into one workspace.",
    icon: StackSimple,
  },
  {
    n: "2",
    title: "Understand",
    body: "See your priorities, uncover relevant information, and use AI assistance to make sense of what needs attention.",
    icon: Eye,
  },
  {
    n: "3",
    title: "Act",
    body: "Focus on the next important task, create with confidence, and end the day with a clearer plan for tomorrow.",
    icon: ArrowRight,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-line bg-panel/30">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="max-w-[62ch]">
          <h2 className={sectionTitle}>A clearer day, in three simple steps.</h2>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex h-full flex-col rounded-xl border border-line bg-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo/12 font-mono text-[13px] text-indigo-soft">
                    {s.n}
                  </span>
                  <s.icon size={16} className="text-ink-faint" />
                </div>
                <h3 className="mt-4 text-[15px] font-medium text-ink">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{s.body}</p>
              </div>
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-1/2 -right-3 hidden h-px w-6 bg-line-strong md:block"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
