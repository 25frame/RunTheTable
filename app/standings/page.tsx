import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StandingsPage() {
  const data = await getRTTData();
  const players = data?.players || [];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Board</p>

        <h1 className="rtt-title">
          The
          <br />
          Board
        </h1>

        <p className="rtt-subtitle">
          Rankings update after verified battles.
        </p>

        <div className="mt-8 grid gap-4">
          {players.map((p) => (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">
                    Rank #{p.rank}
                  </p>

                  <h2 className="mt-2 text-3xl font-black uppercase">
                    {p.handle || p.name}
                  </h2>

                  <p className="mt-1 text-sm font-bold text-white/45">
                    {p.skill}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-4xl font-black text-rtt-red">
                    {p.points}
                  </p>
                  <p className="text-xs font-black uppercase text-white/40">
                    pts
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Stat label="Wins" value={p.wins} />
                <Stat label="Losses" value={p.losses} />
                <Stat label="Diff" value={p.pointDiff} />
              </div>
            </Link>
          ))}

          {!players.length && (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white/50">
              No standings loaded.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}