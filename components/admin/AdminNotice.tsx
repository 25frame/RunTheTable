import type { ReactNode } from "react";

export function AdminNotice({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "warning" | "danger" | "success";
}) {
  const styles =
    tone === "danger"
      ? "border-red-400/30 bg-red-400/10 text-red-50"
      : tone === "warning"
        ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-50"
        : tone === "success"
          ? "border-green-400/30 bg-green-400/10 text-green-50"
          : "border-white/10 bg-white/[0.055] text-white";

  return (
    <div className={`rounded-[1.5rem] border p-4 md:rounded-[2rem] md:p-5 ${styles}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] md:text-sm">
        {title}
      </p>

      <div className="mt-2 text-sm leading-6 text-white/70">{children}</div>
    </div>
  );
}