import Link from "next/link";
import { Card } from "./Card";

type Player = {
  id: string;
  name: string;
  handle: string;
  skill: string;
  rank: number;
  photo: string;
  wins: number;
  losses: number;
  points: number;
};

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link href={`/players/${player.id}`}>
      <Card className="transition hover:translate-y-[-2px] hover:border-rtt-red/70">
        <div className="flex gap-4">
          <img src={player.photo} alt={player.name} className="h-20 w-20 rounded-2xl object-cover grayscale" />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">Rank #{player.rank}</p>
            <h3 className="mt-1 truncate text-2xl font-black uppercase">{player.name}</h3>
            <p className="text-sm text-white/55">{player.handle}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
              {player.wins}-{player.losses} · {player.skill}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
