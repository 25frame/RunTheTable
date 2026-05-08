import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const top = players.slice(0, 5);

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <style>
          {`
            @keyframes rttFadeUp {
              from {
                opacity: 0;
                transform: translateY(14px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .rtt-enter {
              opacity: 0;
              animation: rttFadeUp 520ms ease-out forwards;
            }

            .rtt-enter-1 { animation-delay: 80ms; }
            .rtt-enter-2 { animation-delay: 180ms; }
            .rtt-enter-3 { animation-delay: 280ms; }
            .rtt-enter-4 { animation-delay: 380ms; }

            @media (prefers-reduced-motion: reduce) {
              .rtt-enter {
                animation: none;
                opacity: 1;
                transform: none;
              }
            }
          `}
        </style>

        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rtt-red">
              <span className="-skew-x-12 text-3xl font-black italic text-white">
                R
              </span>
            </div>

            <div>
              <p className="text-lg font-black italic uppercase tracking-[-0.03em]">
                Run The Table
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
                NYC Street Table Tennis
              </p>
            </div>
          </div>

          <Link
            href="/standings"
            className="rounded-full bg-rtt-red px-5 py-3 text-xs font-black uppercase tracking-[0.16em]"
          >
            Board
          </Link>
        </header>

        {/* HERO */}
        <section className="rtt-enter rtt-enter-1 mt-16">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-rtt-red">
            RTT NYC
          </p>

          <h1 className="mt-4 max-w-5xl text-[clamp(4rem,12vw,10rem)] font-black italic uppercase leading-[0.86] tracking-[-0.08em]">
            Run The Table
          </h1>

          <p className="mt-6 max-w-2xl text-xl font-black uppercase leading-8 tracking-[0.02em] text-white/55">
            Scan in. Get ranked. Battle live. Climb the board.
          </p>
        </section>

        {/* CTA */}
        <section className="rtt-enter rtt-enter-2 mt-8 grid gap-3">
          <Link href="/park" className="rtt-cta">
            Get Ranked
          </Link>

          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/join" className="rtt-secondary">
              Join Next Battle
            </Link>

            <Link href="/standings" className="rtt-secondary">
              View The Board
            </Link>
          </div>
        </section>

        {/* TOP BOARD */}
        <section className="rtt-enter rtt-enter-3 mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-rtt-red">
                Live Players
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
                Top Board
              </h2>
            </div>

            <Link
              href="/standings"
              className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red transition hover:text-white"
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
                  className="group border-b border-white/10 py-5 transition hover:border-rtt-red"
                >
                  <div className="flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <p className="truncate text-2xl font-black uppercase tracking-[-0.04em] group-hover:text-rtt-red">
                        #{p.rank} {p.handle || p.name}
                      </p>

                      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/35">
                        {p.wins}W / {p.losses}L · Diff {p.pointDiff}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-3xl font-black text-rtt-red">
                        {p.points}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                        pts
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-lg font-black uppercase">
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

        {/* SIMPLE FOOTER CTA */}
        <section className="rtt-enter rtt-enter-4 mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">
            Street Rules
          </p>

          <p className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
            Winner climbs. Receipts stay on the board.
          </p>
        </section>
      </section>
    </main>
  );
}