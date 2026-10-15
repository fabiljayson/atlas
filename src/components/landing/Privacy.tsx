"use client";

import { Lock } from "@phosphor-icons/react";
import { sectionTitle } from "./shared";

const POINTS = [
  {
    title: "Account authentication",
    body: "Sign up and sign in with email and password. Passwords are hashed with scrypt using a unique random salt per account.",
  },
  {
    title: "Session revocation",
    body: "Session tokens are stored only as SHA-256 hashes in HttpOnly cookies. Signing out deletes the session server-side, on every device.",
  },
  {
    title: "Per-user data storage",
    body: "Every dashboard item — tasks, files, objectives, check-ins, chat — is stored in your account's own rows in SQLite.",
  },
  {
    title: "Login and signup rate limiting",
    body: "Failed logins are throttled per account and per IP, and signups are limited per IP, to slow automated abuse.",
  },
  {
    title: "Server-side AI credentials",
    body: "Provider keys stay on the server. They are never sent to your browser or embedded in client code.",
  },
] as const;

export function Privacy() {
  return (
    <section id="security" className="border-y border-line bg-panel/30">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo/12 text-indigo-soft">
              <Lock size={17} />
            </span>
            <h2 className={`${sectionTitle} mt-4`}>
              Your workspace should work for you. And only you.
            </h2>
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-ink-dim">
              Atlas is built around individual accounts, protected sessions, and
              user-specific data storage.
            </p>
          </div>

          <div>
            <dl className="divide-y divide-line border-y border-line">
              {POINTS.map((p) => (
                <div key={p.title} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                  <dt className="text-[13.5px] font-medium text-ink">{p.title}</dt>
                  <dd className="text-[13.5px] leading-relaxed text-ink-dim">{p.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-faint">
              When an AI provider is configured, the relevant parts of your workspace are
              sent to that provider for a reply and are handled under its own policies.
              Atlas does not run AI models locally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
