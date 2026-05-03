import Link from "next/link";
import type { RTTPlayer } from "@/lib/googleData";
import { getDisplayName, getHeat, getTier } from "@/lib/playerIdentity";
import { IdentityPill } from "@/components/IdentityPill";

export function TopPlayerBanner({ player }: { player?: RTTPlayer }) {
  if (!player) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
        <p className="rtt-kicker">Top Player</p>
        <h2 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em]">
          Board Empty
        </h2>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-white/45">
          First battle sets the tone.
        </p>
      </div>
    );
  }

  const displayName = getDisplayName(player);
  const tier = getTier(player);
  const heat = getHeat(player);

  return (
    <Link href={`/players/${player.id}`} className="block">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-rtt-red/35 bg-rtt-red/10 p-5 shadow-2xl shadow-red-950/30">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-rtt-red/30 blur-3xl" />

        <div className="relative">
          <p className="rtt-kicker">Top Player of the Night</p>

          <h2 className="mt-3 text-5xl font-black italic uppercase leading-none tracking-[-0.08em]">
            {displayName}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            <IdentityPill>#{player.rank}</IdentityPill>
            <IdentityPill>{tier}</IdentityPill>
            <IdentityPill heat={heat}>{heat}</IdentityPill>
            <IdentityPill>{player.wins}W {player.losses}L</IdentityPill>
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/45">
            Beat the board. Take the table.
          </p>
        </div>
      </section>
    </Link>
  );
}
