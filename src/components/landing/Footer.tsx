"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

function useYear() {
  return useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 0,
  );
}

const PRODUCT = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#chief", label: "Chief of staff" },
  { href: "#ritual", label: "Evening check-in" },
] as const;

const LEGAL = [
  { href: "#security", label: "Security" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
] as const;

export function Footer() {
  const year = useYear();

  return (
    <footer className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3" aria-label="Atlas home">
              <LogoMark size={26} className="h-6 w-6" />
              <span className="text-[14px] font-semibold tracking-tight text-ink">
                Atlas
              </span>
            </Link>
            <p className="mt-3 text-[13px] text-ink-dim">Your calm command center.</p>
          </div>

          <nav aria-label="Product">
            <h2 className="font-mono text-[10.5px] tracking-wider text-ink-faint uppercase">
              Product
            </h2>
            <ul className="mt-3 space-y-2">
              {PRODUCT.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] text-ink-dim transition-colors hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Trust">
            <h2 className="font-mono text-[10.5px] tracking-wider text-ink-faint uppercase">
              Trust
            </h2>
            <ul className="mt-3 space-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("#") ? (
                    <a
                      href={l.href}
                      className="text-[13px] text-ink-dim transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-[13px] text-ink-dim transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[10.5px] tracking-wider text-ink-faint uppercase">
              Account
            </h2>
            <div className="mt-3 flex flex-col items-start gap-2.5">
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-lg bg-indigo px-4 text-[13px] font-medium text-white transition-colors hover:bg-indigo-deep"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="text-[13px] text-ink-dim transition-colors hover:text-ink"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-ink-faint">
            {year ? `© ${year} Atlas. All rights reserved.` : "© Atlas. All rights reserved."}
          </p>
          <p className="font-mono text-[11px] text-ink-faint">
            Built as a single-user workspace per account.
          </p>
        </div>
      </div>
    </footer>
  );
}
