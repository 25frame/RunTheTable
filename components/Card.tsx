import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-red-950/10 ${className}`}>
      {children}
    </div>
  );
}
