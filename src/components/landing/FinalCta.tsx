"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { primaryCta, sectionTitle, useHeroRise } from "./shared";
import { motion } from "motion/react";

export function FinalCta() {
  const rise = useHeroRise();

  return (
    <section id="get-started" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <motion.div
        {...rise()}
        className="rounded-xl border border-line bg-panel px-6 py-14 text-center shadow-card sm:px-12"
      >
        <h2 className={`${sectionTitle} mx-auto max-w-[20ch]`}>
          Make room for the work that matters.
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-dim">
          Bring your day into focus with one workspace for priorities, knowledge,
          creativity, and progress.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <Link href="/signup" className={primaryCta}>
            Get started with Atlas
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/login"
            className="text-[13.5px] text-ink-dim transition-colors hover:text-ink"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
