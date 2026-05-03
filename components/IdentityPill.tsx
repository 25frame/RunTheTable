import { getHeatClass, RTTHeat } from "@/lib/playerIdentity";

export function IdentityPill({
  children,
  heat,
  strong = false,
}: {
  children: React.ReactNode;
  heat?: RTTHeat;
  strong?: boolean;
}) {
  const heatClass = heat ? getHeatClass(heat) : "border-white/10 bg-white/5 text-white/65";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
        heatClass,
        strong ? "scale-105" : "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
