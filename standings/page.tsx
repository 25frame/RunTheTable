import { PlayerIdentityCard } from "@/components/PlayerIdentityCard";
import { getRTTData } from "@/lib/googleData";

export default async function StandingsPage() {
  const { players, matches } = await getRTTData();
  const sorted = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Rank decides who talks</p>
        <h1 className="rtt-title">THE<br />BOARD</h1>
        <p className="rtt-subtitle">Wins, streaks, heat, pressure, presence. Climb or get buried.</p>
        <div className="mt-8 grid gap-3">
          {sorted.map((player) => {
            const liveMatch = matches.find((m) => (m.status || "").toLowerCase() === "live" && (m.playerAId === player.id || m.playerBId === player.id));
            return <PlayerIdentityCard key={player.id} player={player} liveMatch={liveMatch} />;
          })}
        </div>
      </section>
    </main>
  );
}
