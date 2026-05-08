import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const top = players.slice(0, 5);
  const king = players[0];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <style>
          {`
            @keyframes rttSlamIn {
              0% {
                opacity: 0;
                transform: translateX(-52px) skewX(-14deg) scale(0.96);
                filter: blur(6px);
              }
              58% {
                opacity: 1;
                transform: translateX(8px) skewX(-14deg) scale(1.02);
                filter: blur(0);
              }
              100% {
                opacity: 1;
                transform: translateX(0) skewX(-14deg) scale(1);
                filter: blur(0);
              }
            }

            @keyframes rttSlash {
              0% {
                transform: translateX(-120%) scaleX(0.2);
                opacity: 0;
              }
              35% {
                opacity: 1;
              }
              100% {
                transform: translateX(0) scaleX(1);
                opacity: 1;
              }
            }

            @keyframes rttFadeUp {
              0% {
                opacity: 0;
                transform: translateY(18px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes rttPulse {
              0%, 100% {
                box-shadow: 0 0 28px rgba(255, 0, 0, 0.28);
                transform: scale(1);
              }
              50% {
                box-shadow: 0 0 46px rgba(255, 0, 0, 0.46);
                transform: scale(1.035);
              }
            }

            .rtt-animate-r {
              animation: rttPulse 2.4s ease-in-out infinite;
            }

            .rtt-hero-word {
              display: block;
              opacity: 0;
              animation: rttSlamIn 680ms cubic-bezier(.2,.9,.2,1) forwards;
            }

            .rtt-hero-word:nth-child(1) {
              animation-delay: 80ms;
            }

            .rtt-hero-word:nth-child(2) {
              animation-delay: 220ms;
            }

            .rtt-hero-word:nth-child(3) {
              animation-delay: 360ms;
            }

            .rtt-slash {
              transform-origin: left center;
              animation: rttSlash 760ms cubic-bezier(.2,.9,.2,1) 520ms forwards;
              opacity: 0;
            }

            .rtt-fade-1 {
              opacity: 0;
              animation: rttFadeUp 520ms ease-out 680ms forwards;
            }

            .rtt-fade-2 {
              opacity: 0;
              animation: rttFadeUp 520ms ease-out 820ms forwards;
            }

            .rtt-fade-3 {
              opacity: 0;
              animation: rttFadeUp 520ms ease-out 960ms forwards;
            }

            @media (prefers-reduced-motion: reduce) {
              .rtt-animate-r,
              .rtt-hero-word,
              .rtt-slash,
              .rtt-fade-1,
              .rtt-fade-2,
              .rtt-fade-3 {
                animation: none;
                opacity: 1;
                transform: none;
                filter: none;
              }
            }
          `}
        </style>

        {/* HERO */}
        <section className="pt-8">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rtt-animate-r grid h-16 w-16 shrink-0 place-items-center rounded-[1.35rem] bg-rtt-red">
                <span className="-skew-x-12 text-3xl font-black italic text-white">
                  R
                </span>
              </div>

              <div>
                <p className="text-xl font-black italic uppercase tracking-[-0.04em]">
                  Run The Table
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/40">
                  NYC Street Table Tennis
                </p>
              </div>
            </div>

            <div className="rounded-full bg-rtt-red px-5 py-3 text-xs font-black uppercase tracking-[0.18em]">
              Live Board
            </div>
          </div>

          <p className="rtt-fade-1 text-xs font-black uppercase tracking-[0.28em] text-rtt-red">
            RTT NYC
          </p>

          <div className="relative mt-4 overflow-hidden">
            <h1 className="text-[clamp(4.8rem,15vw,13rem)] font-black italic uppercase leading-[0.78] tracking-[-0.1em]">
              <span className="rtt-hero-word">Run</span>
              <span className="rtt-hero-word">The</span>
              <span className="rtt-hero-word">Table</span>
            </h1>

            <div className="rtt-slash pointer-events-none absolute left-0 top-[49%] h-3 w-[78%] -rotate-3 bg-rtt-red shadow-[0_0_30px_rgba(255,0,0,0.38)]" />
          </div>

          <div className="rtt-fade-2 mt-6 flex flex-wrap items-center gap-3">
            <p className="text-4xl font-black uppercase tracking-[-0.06em]">
              RTT NYC
            </p>

            <div className="h-[3px] w-16 bg-rtt-red" />

            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">
              Street Table Tennis
            </p>
          </div>

          <p className="rtt-fade-2 mt-8 max-w-2xl text-xl font-black uppercase leading-8 tracking-[0.02em] text-white/60">
            Scan in. Get ranked. Battle live. Climb the board.
          </p>

          <div className="rtt-fade-3 mt-8 grid gap-3">
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
          </div>
        </section>

        {/* STATUS */}
        <section className="rtt-fade-3 mt-10 grid gap-3 md:grid-cols-3">
          <StatBox label="Players" value={players.length} />
          <StatBox label="Battles" value={data?.matches?.length || 0} />
          <StatBox
            label="Current #1"
            value={king ? king.handle || king.name : "Open"}
          />
        </section>

        {/* BOARD */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-rtt-red">
                Top Board
              </p>

              <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.06em]">
                Ranked Players
              </h2>
            </div>

            <Link
              href="/standings"
              className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red transition hover:text-white"
            >
              Full Board
            </Link>
          </div>

          <div className="grid gap-3">
            {top.length ? (
              top.map((p, index) => {
                const isKing = index === 0;
                const displayName = p.handle || p.name;

                return (
                  <Link
                    key={p.id}
                    href={`/players/${p.id}`}
                    className="group border-b border-white/10 py-5 transition hover:border-rtt-red"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={
                            isKing
                              ? "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rtt-red text-lg font-black text-white"
                              : "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-lg font-black text-white/70"
                          }
                        >
                          {isKing ? "R" : `#${p.rank || index + 1}`}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-3xl font-black uppercase tracking-[-0.05em] group-hover:text-rtt-red">
                            {displayName}
                          </p>

                          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/35">
                            #{p.rank || index + 1} · {p.wins}W / {p.losses}L ·{" "}
                            Diff {p.pointDiff}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-4xl font-black text-rtt-red">
                          {p.points}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                          pts
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
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
      </section>
    </main>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 truncate text-3xl font-black uppercase tracking-[-0.05em] text-white">
        {value}
      </p>
    </div>
  );
}