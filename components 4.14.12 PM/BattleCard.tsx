import type { RTTMatch, RTTPlayer } from "@/lib/googleData";
import { IdentityPill } from "@/components/IdentityPill";
import { getMomentTitle } from "@/lib/playerIdentity";

export function BattleCard({
  match,
  players = [],
}: {
  match: RTTMatch;
  players?: RTTPlayer[];
}) {
  const moment = getMomentTitle(match, players);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <IdentityPill>{match.status || "Scheduled"}</IdentityPill>
            <IdentityPill>{match.type || "Battle"}</IdentityPill>
            {moment && <IdentityPill heat="HOT">{moment}</IdentityPill>}
          </div>

          <h3 className="mt-4 truncate text-2xl font-black italic uppercase leading-none tracking-[-0.06em]">
            {match.playerA} <span className="text-rtt-red">vs</span> {match.playerB}
          </h3>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/35">
            {match.table || "Table"} / {match.matchId}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-4xl font-black text-rtt-red">{match.score}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            {match.winner ? `${match.winner} won` : "No winner"}
          </p>
        </div>
      </div>
    </article>
  );
}
