import Link from "next/link";
import { Card } from "./Card";
import type { RTTPlayer } from "@/lib/googleData";

export function PlayerCard({ player }: { player: RTTPlayer }) {
  const hasPhoto = player.photo && player.photo.trim() !== "";
  const photo = hasPhoto ? player.photo : "/rtt-logo.png";

  return (
    <Link href={`/players/${player.id}`}>
      <Card className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:border-rtt-red/70">
        <div className="grid grid-cols-[115px_1fr] gap-0">
          <div className="h-32 w-full bg-black">
            <img
              src={photo}
              alt={player.name}
              className={
                hasPhoto
                  ? "h-full w-full object-cover grayscale transition group-hover:grayscale-0"
                  : "h-full w-full object-contain p-3 transition group-hover:scale-105"
              }
            />
          </div>

          <div className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">
              Rank #{player.rank}
            </p>
            <h3 className="mt-1 truncate text-2xl font-black italic uppercase">
              {player.name}
            </h3>
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
