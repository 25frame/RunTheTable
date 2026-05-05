import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export default async function HomePage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const top = players.slice(0, 5);

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Start Here</p>

        <h1 className="rtt-title">
          Run The
          <br />
          Table
        </h1>

        <p className="rtt-subtitle">
          Scan in. Join the board. Battle live. Climb the ranking.
        </p>

        <div className="mt-8 grid gap-3">
          <Link href="/park" className="rtt-cta">
            Start Here
          </Link>

          <Link href="/join" className="rtt-secondary">
            Join Next Battle
          </Link>

          <Link href="/live" className="rtt-secondary">
            Watch Live
          </Link>
        </div>

        <section className="mt-10">
          <p className="rtt-kicker">Live Players</p>

          <div className="mt-5 grid gap-4">
            {top.map((p) => (
              <Link
                key={p.id}
                href={`/players/${p.id}`}
                className="border-b border-white/10 pb-4 text-2xl font-bold"
              >
                #{p.rank} {p.handle || p.name} — {p.points}
              </Link>
            ))}

            {!top.length && (
              <p className="text-white/40">No players loaded yet.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}