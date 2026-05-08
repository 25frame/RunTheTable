import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const top = players.slice(0, 5);

  return (
    <main className="rtt-shell min-h-screen pb-28 text-white">
      <section className="mx-auto w-full max-w-5xl px-5 pt-6 md:px-8 md:pt-10">
        {/* HERO */}
        <section>
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-rtt-red">
            RTT NYC
          </p>

          <h1 className="mt-3 max-w-4xl text-[clamp(3.4rem,14vw,8rem)] font-black italic uppercase leading-[0.84] tracking-[-0.08em]">
            Run The
            <br />
            Table
          </h1>

          <p className="mt-4 max-w-2xl text-base font-black uppercase leading-7 tracking-[0.03em] text-white/55 md:text-xl">
            Scan in. Get ranked. Battle live. Climb the board.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-6 grid gap-3">
          <Link href="/park" className="rtt-cta">
            Get Ranked
          </Link>

          <Link href="/join" className="rtt-secondary">
            Join Next Battle
          </Link>

          <Link href="/standings" className="rtt-secondary">
            View The Board
          </Link>
        </section>

        {/* TOP BOARD */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-rtt-red">
                Live Players
              </p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                Top Board
              </h2>
            </div>

            <Link
              href="/standings"
              className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red"
            >
              Full Board
            </Link>
          </div>

          <div className="grid gap-0">
            {top.length ? (
              top.map((p) => (
                <Link
                  key={p.id}
                  href={`/players/${p.id}`}
                  className="group border-b border-white/10 py-4 transition hover:border-rtt-red"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-xl font-black uppercase tracking-[-0.04em] group-hover:text-rtt-red md:text-2xl">
                        #{p.rank} {p.handle || p.name}
                      </p>

                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/35 md:text-xs">
                        {p.wins}W / {p.losses}L · Diff {p.pointDiff}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-black text-rtt-red md:text-3xl">
                        {p.points}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
                        pts
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-base font-black uppercase">
                  No players loaded yet.
                </p>

                {data?.error ? (
                  <p className="mt-3 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-200">
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