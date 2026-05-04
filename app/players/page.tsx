"use client";
import { getRTTData } from "@/lib/googleData";
import { CompetitorCard } from "@/components/CompetitorCard";

export default async function PlayersPage() {
  const { players } = await getRTTData();

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Competitors</p>
        <h1 className="rtt-title">THE<br />CREW</h1>
        <p className="rtt-subtitle">Every name on the board can be called out.</p>

        <div className="mt-8 grid gap-3">
          {players.map((player) => <CompetitorCard key={player.id} player={player} />)}
        </div>
      </section>
    </main>
  );
}
