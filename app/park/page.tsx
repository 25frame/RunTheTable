import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ParkPage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const matches = data?.matches || [];
  const formUrl = data?.formUrl || "/join";

  const topPlayer = players[0];
  const liveMatch =
    matches.find((m) => (m.status || "").toLowerCase() === "live") ||
    matches[0];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">You Found The Table</p>

        <h1 className="rtt-title">
          Run The
          <br />
          Table
        </h1>

        <p className="rtt-subtitle">
          Watch live. Join the board. Play the next battle.
        </p>

        {liveMatch && (
          <div className="mt-8 rounded-[2rem] border border-rtt-red/35 bg-rtt-red/10 p-6">
            <p className="rtt-kicker">Playing Now</p>

            <h2 className="mt-3 text-3xl font-black uppercase">
              {liveMatch.playerA} vs {liveMatch.playerB}
            </h2>

            <p className="mt-4 text-6xl font-black text-rtt-red">
              {liveMatch.scoreA} — {liveMatch.scoreB}
            </p>
          </div>
        )}

        {topPlayer && (
          <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="rtt-kicker">Current King</p>

            <h2 className="mt-3 text-4xl font-black uppercase">
              {topPlayer.handle || topPlayer.name}
            </h2>

            <p className="mt-2 text-sm font-bold text-white/45">
              Rank #{topPlayer.rank} / {topPlayer.wins}W {topPlayer.losses}L
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3">
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rtt-cta"
          >
            Join Next Battle
          </a>

          <Link href="/live" className="rtt-secondary">
            Watch Live
          </Link>

          <Link href="/standings" className="rtt-secondary">
            View Board
          </Link>

          <Link href="/rules" className="rtt-secondary">
            Rules
          </Link>
        </div>
      </section>
    </main>
  );
}