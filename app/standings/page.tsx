import { getRTTData } from "@/lib/googleData";
import { CompetitorCard } from "@/components/CompetitorCard";

export default async function StandingsPage() {
  const { players } = await getRTTData();
  const sorted = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Rank decides who talks</p>
        <h1 className="rtt-title">THE<br />BOARD</h1>
        <p className="rtt-subtitle">Wins, streaks, pressure, presence. Climb or get buried.</p>

        <div className="mt-8 grid gap-3">
          {sorted.map((player) => <CompetitorCard key={player.id} player={player} />)}
        </div>
      </section>
    </main>
  );
}
