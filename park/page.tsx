import { TopPlayerBanner } from "@/components/TopPlayerBanner";
import { ViralCTA } from "@/components/ViralCTA";
import { getRTTData } from "@/lib/googleData";

export default async function ParkPage() {
  const { players, matches, formUrl } = await getRTTData();
  const topPlayer = players[0];
  const liveMatch = matches.find((m) => (m.status || "").toLowerCase() === "live");

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">You found the table</p>
        <h1 className="rtt-title">RUN<br />THE<br />TABLE</h1>
        <p className="rtt-subtitle">Scan in. Watch the live battle. Get on the board.</p>
        <div className="mt-7"><TopPlayerBanner player={topPlayer} /></div>
        {liveMatch && (
          <div className="mt-5 rounded-[2rem] border border-rtt-red/35 bg-rtt-red/10 p-5">
            <p className="rtt-kicker">Playing Now</p>
            <h2 className="mt-3 text-3xl font-black italic uppercase tracking-[-0.06em]">{liveMatch.playerA} vs {liveMatch.playerB}</h2>
            <p className="mt-3 text-6xl font-black text-rtt-red">{liveMatch.scoreA} — {liveMatch.scoreB}</p>
          </div>
        )}
        <div className="mt-6"><ViralCTA formUrl={formUrl} compact /></div>
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">House Code</p>
          <div className="mt-4 grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-white/65">
            <p>First to 11. Win by 2.</p><p>No soft games.</p><p>Respect the table.</p><p>Winner stays up.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
