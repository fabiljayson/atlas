import type { ReactNode } from "react";
import Link from "next/link";
import { LogoMark } from "./Logo";

export const LEGAL_ROUTES = [
  { href: "/legal", label: "Legal notice" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
  { href: "/cookies", label: "Cookie policy" },
] as const;

/**
 * Clearly-marked placeholder for information that must be confirmed by the
 * operator (identity, hosting, jurisdiction, contacts). Nothing on Atlas is
 * published as a legal fact while it sits inside this marker.
 */
export function Ph({ children }: { children?: ReactNode }) {
  return (
    <mark className="rounded border border-urgent/40 bg-urgent/10 px-1 py-0.5 align-baseline font-mono text-[0.82em] font-medium tracking-tight text-urgent-ink [text-decoration:none]">
      {children}
    </mark>
  );
}

export function LegalShell({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <a
        href="#legal-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-indigo focus:px-3 focus:py-2 focus:text-[13px] focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Atlas home">
            <LogoMark size={28} className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight text-ink">Atlas</span>
          </Link>
          <span className="ml-auto font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
            {subtitle}
          </span>
        </div>
      </header>

      <main id="legal-content" className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl leading-tight font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 font-mono text-[11px] text-ink-faint">Last reviewed: {updated}</p>
        <article className="legal mt-8">{children}</article>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-ink-faint">
            {LEGAL_ROUTES.map(({ href, label }) => (
              <Link key={href} href={href} className="transition-colors hover:text-ink-dim">
                {label}
              </Link>
            ))}
          </div>
          <Link href="/signup" className="text-[13px] text-indigo transition-colors hover:text-indigo-deep">
            Get your Atlas
          </Link>
        </div>
      </footer>
    </div>
  );
}
