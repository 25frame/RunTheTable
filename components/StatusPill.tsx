import type { RTTPlayer } from "@/lib/googleData";

export function getTier(player: Pick<RTTPlayer, "rank" | "wins" | "losses">) {
  if (player.rank === 1) return "KING";
  if (player.wins >= 5) return "RUNNER";
  if (player.wins >= 3) return "TABLE KILLER";
  if (player.wins >= 2) return "CONTENDER";
  if (player.wins >= 1) return "CHALLENGER";
  return "ROOKIE";
}

export function getStatus(player: Pick<RTTPlayer, "rank" | "wins" | "losses" | "pointDiff">) {
  if (player.rank === 1) return "TABLE KING";
  if (player.pointDiff > 5) return "HEAT CHECK";
  if (player.wins === 0 && player.losses === 0) return "UNTESTED";
  if (player.losses > player.wins) return "HUNGRY";
  return "ACTIVE";
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/65">
      {children}
    </span>
  );
}
