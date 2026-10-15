"use client";

import { type ButtonHTMLAttributes, type ReactNode, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import type { Urgency } from "@/lib/types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 active:translate-y-px disabled:opacity-40 disabled:pointer-events-none",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        variant === "primary" &&
          "bg-indigo-deep text-white hover:bg-[#5b53f0] shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
        variant === "outline" &&
          "border border-line bg-panel text-ink hover:border-[#2a3358] hover:bg-panel-2",
        variant === "ghost" && "text-ink-dim hover:text-ink hover:bg-panel-2",
        className,
      )}
      {...props}
    />
  );
}

const urgencyStyles: Record<Urgency, string> = {
  critical: "text-critical border-[#3a2230] bg-[#1d1220]",
  high: "text-urgent border-[#3a2f1e] bg-[#1c1710]",
  normal: "text-indigo border-[#2a2f55] bg-[#161a33]",
  low: "text-ink-faint border-line bg-panel",
};

export function UrgencyBadge({ level, label }: { level: Urgency; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase",
        urgencyStyles[level],
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {label ?? level}
    </span>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-line bg-panel/80 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between border-b border-line-soft px-4 py-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-sm font-medium text-ink">{title}</h2>
        {meta ? <span className="font-mono text-[11px] text-ink-faint">{meta}</span> : null}
      </div>
      {action}
    </header>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block gap-1.5">
      <span className="text-[12px] font-medium text-ink-dim">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-ink-faint">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-[#35407a] focus:outline-none transition-colors";

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "anim-fade-up w-full rounded-2xl border border-line bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
          width,
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <h2 className="text-[15px] font-medium text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-faint transition-colors hover:bg-panel-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-panel-2", className)} />;
}
