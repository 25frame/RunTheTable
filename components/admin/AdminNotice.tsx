export function AdminNotice({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "info" | "warning" | "danger" | "success";
}) {
  const styles =
    tone === "danger"
      ? "border-red-400/30 bg-red-400/10"
      : tone === "warning"
      ? "border-yellow-400/30 bg-yellow-400/10"
      : tone === "success"
      ? "border-green-400/30 bg-green-400/10"
      : "border-white/10 bg-white/[0.055]";

  return (
    <div className={`rounded-[2rem] border p-5 ${styles}`}>
      <p className="text-sm font-black uppercase tracking-[0.18em]">
        {title}
      </p>
      <div className="mt-2 text-sm leading-6 text-white/70">{children}</div>
    </div>
  );
}