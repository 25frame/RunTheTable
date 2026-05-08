import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const revalidate = 60;

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
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="rtt-kicker">Live Players</p>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.04em]">
                Top Board
              </h2>
            </div>

            <Link
              href="/standings"
              className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red"
            >
              Full Board
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            {top.length ? (
              top.map((p) => (
                <Link
                  key={p.id}
                  href={`/players/${p.id}`}
                  className="border-b border-white/10 pb-4 text-2xl font-bold transition hover:border-rtt-red hover:text-rtt-red"
                >
                  #{p.rank} {p.handle || p.name} — {p.points}
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-white/40">No players loaded yet.</p>

                {data?.error ? (
                  <p className="mt-2 text-xs text-red-300">
                    Feed error: {data.error}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}