"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { AuthError, AuthShell, useAuthSubmit } from "@/components/auth";
import { Button, Field, inputClass } from "@/components/ui";

export default function LoginPage() {
  const { submit, loading, error } = useAuthSubmit("/api/auth/login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Your Atlas kept everything where you left it."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-indigo hover:underline">
            Create your Atlas
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit({ email, password });
        }}
      >
        <AuthError error={error} />
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
        <Field label="Password">
          <input
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || !email || !password}
        >
          {loading ? <Spinner size={15} className="animate-spin" /> : null}
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
