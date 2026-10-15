"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { AuthError, AuthShell, useAuthSubmit } from "@/components/auth";
import { Button, Field, inputClass } from "@/components/ui";

export default function SignupPage() {
  const { submit, loading, error } = useAuthSubmit("/api/auth/signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Get your Atlas"
      subtitle="Two minutes to set up. Your calm command center after that."
      footer={
        <>
          Already have one?{" "}
          <Link href="/login" className="font-medium text-indigo hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit({ name, email, password });
        }}
      >
        <AuthError error={error} />
        <Field label="Name">
          <input
            autoComplete="name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <input
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            required
            minLength={8}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || !name || !email || password.length < 8}
        >
          {loading ? <Spinner size={15} className="animate-spin" /> : null}
          {loading ? "Creating…" : "Create my Atlas"}
        </Button>
        <p className="text-[12px] leading-relaxed text-ink-dim">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="text-indigo hover:underline">
            terms of use
          </Link>{" "}
          and acknowledge the{" "}
          <Link href="/privacy" className="text-indigo hover:underline">
            privacy policy
          </Link>
          . Atlas collects only your name, email and password here. No marketing emails are
          sent, and the only cookie is the login session (no analytics or advertising). See
          the{" "}
          <Link href="/cookies" className="text-indigo hover:underline">
            cookie policy
          </Link>
          . Atlas is intended for people aged 16 and over.
        </p>
      </form>
    </AuthShell>
  );
}
