"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/components/ui";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#security", label: "Security" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-bar sticky top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Atlas home">
          <LogoMark size={28} className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight text-ink">Atlas</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-[13.5px] text-ink-dim transition-colors hover:bg-panel-2 hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-lg bg-indigo px-4 text-[13.5px] font-medium text-white transition-all hover:bg-indigo-deep active:translate-y-px"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-ink-dim transition-colors hover:bg-panel-2 hover:text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={cn("border-t border-line-soft px-6 py-4 md:hidden", open ? "block" : "hidden")}
      >
        <ul className="space-y-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-[14px] text-ink-dim transition-colors hover:bg-panel-2 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2 border-t border-line-soft pt-4">
          <Link
            href="/login"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-line-strong bg-panel text-[13.5px] font-medium text-ink transition-colors hover:border-indigo"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-indigo text-[13.5px] font-medium text-white transition-colors hover:bg-indigo-deep"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
