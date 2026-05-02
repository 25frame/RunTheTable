"use client";
export function ScoreButton({ children, onClick, tone = "primary" }: { children: React.ReactNode; onClick: () => void; tone?: "primary" | "muted" | "danger" }) {
  const cls = tone === "danger" ? "bg-white/10 text-white/70" : tone === "muted" ? "bg-white/10 text-white" : "bg-rtt-red text-white";
  return <button onClick={onClick} className={`${cls} rounded-2xl px-6 py-5 text-xl font-black uppercase shadow-lg transition active:scale-95`}>{children}</button>;
}
