import Link from "next/link";
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

        <p className="rtt-subtitle">
          Scan in. Watch the live battle. Get on the board.
        </p>

        {topPlayer && (
          <div className="mt-8 rounded-[2rem] border border-rtt-red/35 bg-rtt-red/10 p-6">
            <p className="rtt-kicker">Top Player</p>
            <h2 className="mt-3 text-5xl font-black italic uppercase tracking-[-0.08em]">
              {topPlayer.handle || topPlayer.name}
            </h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-white/50">
              Rank #{topPlayer.rank} / {topPlayer.wins}W {topPlayer.losses}L
            </p>
          </div>
        )}

        {liveMatch && (
          <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6">
            <p className="rtt-kicker">Playing Now</p>
            <h2 className="mt-3 text-3xl font-black italic uppercase">
              {liveMatch.playerA} vs {liveMatch.playerB}
            </h2>
            <p className="mt-3 text-6xl font-black text-rtt-red">
              {liveMatch.scoreA} — {liveMatch.scoreB}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3">
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="rtt-cta">
            Join Next Battle
          </a>

          <Link href="/live" className="rtt-secondary">
            Watch Live
          </Link>

          <Link href="/standings" className="rtt-secondary">
            View The Board
          </Link>

          <Link href="/rules" className="rtt-secondary">
            See Rules
          </Link>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <p className="rtt-kicker">House Code</p>
          <div className="mt-4 grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-white/65">
            <p>First to 11. Win by 2.</p>
            <p>No soft games.</p>
            <p>Respect the table.</p>
            <p>Winner stays up.</p>
          </div>
        </div>
      </section>
    </main>
  );
}