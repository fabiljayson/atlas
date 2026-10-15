import { useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function useHeroRise() {
  const reduce = useReducedMotion();
  return (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.32, delay, ease: EASE },
        };
}

export const primaryCta =
  "inline-flex h-11 items-center gap-2 rounded-lg bg-indigo px-6 text-sm font-medium text-white transition-all hover:bg-indigo-deep active:translate-y-px";

export const secondaryCta =
  "inline-flex h-11 items-center rounded-lg border border-line-strong bg-panel px-6 text-sm font-medium text-ink transition-all hover:border-indigo hover:bg-panel-2 active:translate-y-px";

export const sectionTitle =
  "text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl";
