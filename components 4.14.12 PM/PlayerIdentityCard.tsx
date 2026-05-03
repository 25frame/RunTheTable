import Link from "next/link";
import type { RTTMatch, RTTPlayer } from "@/lib/googleData";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { IdentityPill } from "@/components/IdentityPill";
import { formatRecord, getDisplayName, getHeat, getStatus, getTier } from "@/lib/playerIdentity";

export function PlayerIdentityCard({
  player,
  liveMatch,
}: {
  player: RTTPlayer;
  liveMatch?: RTTMatch;
}) {
  const tier = getTier(player);
  const heat = getHeat(player);
  const status = getStatus(player, liveMatch);
  const displayName = getDisplayName(player);

  return (
    <Link href={`/players/${player.id}`} className="block">
      <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/40 transition active:scale-[0.985]">
        <div className="grid grid-cols-[108px_1fr]">
          <div className="relative h-40 bg-black">
            <PlayerAvatar player={player} />
            <div className="absolute left-2 top-2 rounded-full bg-rtt-red px-2.5 py-1 text-[10px] font-black">
              #{player.rank}
            </div>
          </div>

          <div className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-rtt-red">
                  {tier}
                </p>
                <h3 className="mt-1 truncate text-3xl font-black italic uppercase leading-none tracking-[-0.07em]">
                  {displayName}
                </h3>
              </div>

              <div className="shrink-0 rounded-full bg-rtt-red px-3 py-1 text-xs font-black">
                {player.points}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <IdentityPill heat={heat} strong={heat === "ON FIRE"}>
                {heat}
              </IdentityPill>
              <IdentityPill>{status}</IdentityPill>
              <IdentityPill>{formatRecord(player)}</IdentityPill>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <MiniStat label="Diff" value={`${player.pointDiff > 0 ? "+" : ""}${player.pointDiff}`} />
              <MiniStat label="Wins" value={player.wins} />
              <MiniStat label="Loss" value={player.losses} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/45 px-2 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>
      <p className="mt-1 text-base font-black text-white">{value}</p>
    </div>
  );
}
