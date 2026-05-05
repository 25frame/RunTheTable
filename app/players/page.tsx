import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayersPage() {
  const data = await getRTTData();
  const players = data?.players || [];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Crew</p>

        <h1 className="rtt-title">
          The
          <br />
          Crew
        </h1>

        <p className="rtt-subtitle">
          Every player on the table. Every name can be called out.
        </p>

        <div className="mt-8 grid gap-4">
          {players.map((p) => (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">
                {p.id} / Rank #{p.rank}
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                {p.handle || p.name}
              </h2>

              <p className="mt-2 text-sm font-bold text-white/45">
                {p.skill} / {p.wins}W {p.losses}L / {p.points} pts
              </p>
            </Link>
          ))}

          {!players.length && (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white/50">
              No players loaded.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}