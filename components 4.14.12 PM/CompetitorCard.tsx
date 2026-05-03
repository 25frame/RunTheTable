import Link from "next/link";
import type { RTTPlayer } from "@/lib/googleData";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { getStatus, getTier, StatusPill } from "@/components/StatusPill";

export function CompetitorCard({ player }: { player: RTTPlayer }) {
  const tier = getTier(player);
  const status = getStatus(player);

  return (
    <Link href={`/players/${player.id}`} className="block">
      <article className="rtt-card overflow-hidden transition active:scale-[0.985]">
        <div className="grid grid-cols-[104px_1fr] gap-0">
          <div className="h-36 bg-black">
            <PlayerAvatar player={player} />
          </div>

          <div className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rtt-red">#{player.rank} / {tier}</p>
                <h3 className="mt-1 truncate text-3xl font-black italic uppercase leading-none tracking-[-0.06em]">
                  {player.handle || player.name}
                </h3>
              </div>

              <div className="shrink-0 rounded-full bg-rtt-red px-3 py-1 text-xs font-black">
                {player.points}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill>{status}</StatusPill>
              <StatusPill>{player.wins}W {player.losses}L</StatusPill>
            </div>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white/35">
              Diff {player.pointDiff > 0 ? "+" : ""}{player.pointDiff}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
