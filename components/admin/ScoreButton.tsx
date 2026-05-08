"use client";

import type { ReactNode } from "react";

export function ScoreButton({
  children,
  onClick,
  tone = "primary",
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "primary" | "muted" | "danger";
  disabled?: boolean;
}) {
  const cls =
    tone === "danger"
      ? "border border-red-400/30 bg-red-400/10 text-red-50"
      : tone === "muted"
        ? "border border-white/10 bg-white/10 text-white"
        : "bg-rtt-red text-white";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${cls} rounded-2xl px-5 py-4 text-base font-black uppercase tracking-[0.08em] shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 md:px-6 md:py-5 md:text-xl`}
    >
      {children}
    </button>
  );
}