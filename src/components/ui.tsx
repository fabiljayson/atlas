"use client";

import { type ButtonHTMLAttributes, type ReactNode, useEffect, useRef } from "react";
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
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-fast active:translate-y-px disabled:opacity-40 disabled:pointer-events-none",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        variant === "primary" &&
          "bg-indigo text-white hover:bg-indigo-deep shadow-[0_1px_0_rgba(255,255,255,0.16)_inset]",
        variant === "outline" &&
          "border border-line-strong bg-panel text-ink hover:border-indigo hover:bg-panel-2",
        variant === "ghost" && "text-ink-dim hover:text-ink hover:bg-panel-2",
        className,
      )}
      {...props}
    />
  );
}

const urgencyStyles: Record<Urgency, string> = {
  critical: "text-critical-ink border-critical/30 bg-critical/10",
  high: "text-urgent-ink border-urgent/30 bg-urgent/10",
  normal: "text-indigo border-indigo/30 bg-indigo/10",
  low: "text-ink-faint border-line bg-panel",
};

export function UrgencyBadge({ level, label }: { level: Urgency; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded border px-2 py-1 font-mono text-[10px] tracking-wide uppercase",
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
        "glass rounded-xl border border-line",
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
    <label className="block gap-2">
      <span className="text-[12px] font-medium text-ink-dim">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-ink-faint">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-indigo transition-colors";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "anim-fade-up w-full rounded-xl border border-line bg-panel shadow-modal focus:outline-none",
          width,
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex items-center justify-between border-b border-line-soft px-6 py-4">
          <h2 className="text-[15px] font-medium text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-ink-faint transition-colors hover:bg-panel-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </header>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-panel-2", className)} />;
}
