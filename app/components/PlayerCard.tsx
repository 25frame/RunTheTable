import Link from "next/link";
import { Card } from "./Card";
import { PlayerAvatar } from "./PlayerAvatar";
import type { RTTPlayer } from "@/lib/googleData";

export function PlayerCard({ player }: { player: RTTPlayer }) {
  return (
    <Link href={`/players/${player.id}`}>
      <Card className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:border-rtt-red/70">
        <div className="grid grid-cols-[115px_1fr] gap-0">
          <div className="h-32"><PlayerAvatar player={player} /></div>
          <div className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">Rank #{player.rank}</p>
            <h3 className="mt-1 truncate text-2xl font-black italic uppercase">{player.name}</h3>
            <p className="text-sm text-white/50">{player.handle}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              {player.wins}-{player.losses} · {player.points} pts · {player.skill}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
