import Link from "next/link";
import { TopPlayerBanner } from "@/components/TopPlayerBanner";
import { PlayerIdentityCard } from "@/components/PlayerIdentityCard";
import { ViralCTA } from "@/components/ViralCTA";
import { getRTTData } from "@/lib/googleData";

export default async function HomePage() {
  const { players, matches, formUrl } = await getRTTData();
  const top = players.slice(0, 5);
  const topPlayer = players[0];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">NYC Street Table Tennis</p>
        <h1 className="rtt-title">RUN<br />THE<br />TABLE</h1>
        <p className="rtt-subtitle">Show up. Battle. Climb the board. No soft games.</p>
        <ViralCTA formUrl={formUrl} />
        <div className="mt-8"><TopPlayerBanner player={topPlayer} /></div>
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="rtt-kicker">The Board</p>
              <h2 className="mt-1 text-3xl font-black italic uppercase tracking-[-0.05em]">Top Competitors</h2>
            </div>
            <Link href="/standings" className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">Full Board</Link>
          </div>
          <div className="grid gap-3">
            {top.map((player) => {
              const liveMatch = matches.find((m) => (m.status || "").toLowerCase() === "live" && (m.playerAId === player.id || m.playerBId === player.id));
              return <PlayerIdentityCard key={player.id} player={player} liveMatch={liveMatch} />;
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
