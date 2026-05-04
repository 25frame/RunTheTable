import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { CompetitorCard } from "@/components/CompetitorCard";

export default async function HomePage() {
  const { players, formUrl } = await getRTTData();
  const top = players.slice(0, 5);

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">NYC Street Table Tennis</p>
        <h1 className="rtt-title">RUN<br />THE<br />TABLE</h1>
        <p className="rtt-subtitle">Show up. Battle. Climb the board. No soft games.</p>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:flex">
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="rtt-cta">Join Next Battle</a>
          <Link href="/standings" className="rtt-secondary">View The Board</Link>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="rtt-kicker">The Board</p>
              <h2 className="mt-1 text-3xl font-black italic uppercase tracking-[-0.05em]">Top Competitors</h2>
            </div>
            <Link href="/standings" className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">Full Board</Link>
          </div>

          <div className="grid gap-3">
            {top.map((player) => <CompetitorCard key={player.id} player={player} />)}
          </div>
        </section>
      </section>
    </main>
  );
}
