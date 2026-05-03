import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { getStatus, getTier, StatusPill } from "@/components/StatusPill";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { players, matches } = await getRTTData();
  const player = players.find((p) => p.id === id);

  if (!player) notFound();

  const playerMatches = matches.filter(
    (m) =>
      m.playerAId === player.id ||
      m.playerBId === player.id ||
      m.playerA === player.name ||
      m.playerB === player.name
  );

  const liveMatch = playerMatches.find((m) => (m.status || "").toLowerCase() === "live");
  const tier = getTier(player);
  const status = getStatus(player);

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <div className="rtt-card overflow-hidden">
          <div className="h-80 bg-black">
            <PlayerAvatar player={player} />
          </div>

          <div className="p-5">
            <p className="rtt-kicker">Competitor Profile</p>
            <h1 className="mt-3 text-6xl font-black italic uppercase leading-none tracking-[-0.08em]">
              {player.handle || player.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <StatusPill>#{player.rank}</StatusPill>
              <StatusPill>{tier}</StatusPill>
              <StatusPill>{status}</StatusPill>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Stat label="Wins" value={player.wins} />
              <Stat label="Losses" value={player.losses} />
              <Stat label="Score" value={player.points} />
            </div>

            <Link href={`/players/${player.id}/edit`} className="rtt-cta mt-6 w-full">
              Edit Profile
            </Link>
          </div>
        </div>

        {liveMatch && (
          <section className="rtt-card mt-5 p-5">
            <p className="rtt-kicker">Live Now</p>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <p className="text-left text-3xl font-black italic uppercase leading-none">{liveMatch.playerA}</p>
              <p className="text-2xl font-black text-rtt-red">VS</p>
              <p className="text-right text-3xl font-black italic uppercase leading-none">{liveMatch.playerB}</p>
            </div>
            <p className="mt-5 text-center text-7xl font-black">
              {liveMatch.scoreA} — {liveMatch.scoreB}
            </p>
          </section>
        )}

        <section className="mt-6">
          <p className="rtt-kicker">Battle Log</p>
          <div className="mt-4 grid gap-3">
            {playerMatches.slice(0, 8).map((m) => (
              <div key={`${m.matchId}-${m.row}`} className="rtt-card p-4">
                <p className="text-lg font-black uppercase">{m.playerA} vs {m.playerB}</p>
                <p className="mt-1 text-sm text-white/50">
                  {m.score} / Winner: {m.winner || "TBD"} / {m.status || "Scheduled"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/55 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}
