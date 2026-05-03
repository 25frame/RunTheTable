import type { RTTMatch } from "@/lib/googleData";
import { IdentityPill } from "@/components/IdentityPill";

export function LiveBattleHero({ match }: { match: RTTMatch }) {
  const isLive = (match.status || "").toLowerCase() === "live";

  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-rtt-red/35 bg-rtt-red/10 p-5 shadow-2xl shadow-red-950/30">
      <div className="flex items-center justify-between gap-3">
        <IdentityPill heat={isLive ? "ON FIRE" : undefined}>
          {(match.status || "Battle").toUpperCase()}
        </IdentityPill>

        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
          {match.type || "Street"} / Row {match.row}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <h2 className="min-w-0 break-words text-left text-4xl font-black italic uppercase leading-none tracking-[-0.07em]">
          {match.playerA}
        </h2>
        <div className="text-2xl font-black text-rtt-red">VS</div>
        <h2 className="min-w-0 break-words text-right text-4xl font-black italic uppercase leading-none tracking-[-0.07em]">
          {match.playerB}
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="rounded-[2rem] bg-black/70 p-5 text-center">
          <p className="text-8xl font-black leading-none">{match.scoreA}</p>
        </div>

        <div className="text-4xl font-black text-white/25">—</div>

        <div className="rounded-[2rem] bg-black/70 p-5 text-center">
          <p className="text-8xl font-black leading-none">{match.scoreB}</p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.22em] text-white/35">
        Game to 11 / Win by 2
      </p>
    </section>
  );
}
