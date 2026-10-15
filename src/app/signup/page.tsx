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
      </form>
    </AuthShell>
  );
}
