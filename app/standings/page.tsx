import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const data = await getRTTData();
  const players = data?.players || [];

  return (
    <main className="rtt-shell min-h-screen pb-32 text-white">
      <section className="mx-auto w-full max-w-5xl px-5 pt-8 md:px-8 md:pt-14">
        {/* HERO */}
        <section>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-rtt-red">
            Board
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[clamp(3.6rem,18vw,8rem)] font-black italic uppercase leading-[0.8] tracking-[-0.09em]">
                The
                <br />
                Board
              </h1>
            </div>

            <div className="mb-2 hidden rounded-full bg-rtt-red px-5 py-3 text-xs font-black uppercase tracking-[0.18em] md:block">
              Live
            </div>
          </div>

          <p className="mt-5 max-w-xl text-base font-black uppercase leading-7 tracking-[0.04em] text-white/50 md:text-xl">
            Rankings update after verified battles.
          </p>
        </section>

        {/* QUICK STATS */}
        <section className="mt-7 grid grid-cols-3 gap-2">
          <MiniStat label="Players" value={players.length} />
          <MiniStat
            label="King"
            value={players[0]?.handle || players[0]?.name || "Open"}
          />
          <MiniStat
            label="Top Pts"
            value={players[0]?.points ?? 0}
          />
        </section>

        {/* BOARD LIST */}
        <section className="mt-7 grid gap-3">
          {players.length ? (
            players.map((p, index) => {
              const isKing = index === 0;
              const displayName = p.handle || p.name;

              return (
                <Link
                  key={p.id}
                  href={`/players/${p.id}`}
                  className={
                    isKing
                      ? "rounded-[1.75rem] border border-rtt-red/40 bg-rtt-red/10 p-4 shadow-[0_0_32px_rgba(255,0,0,0.12)] transition active:scale-[0.99] md:p-5"
                      : "rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-4 transition active:scale-[0.99] md:p-5"
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={
                          isKing
                            ? "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rtt-red text-base font-black text-white"
                            : "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-black/50 text-base font-black text-white/70"
                        }
                      >
                        #{p.rank}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-2xl font-black uppercase tracking-[-0.05em] md:text-3xl">
                          {displayName}
                        </p>

                        <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                          {p.skill || "Unranked"}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-4xl font-black leading-none text-rtt-red">
                        {p.points}
                      </p>

                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                        pts
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <CompactStat label="W" value={p.wins} />
                    <CompactStat label="L" value={p.losses} />
                    <CompactStat label="Diff" value={p.pointDiff} />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 text-white/50">
              <p className="font-black uppercase">No standings loaded.</p>

              {data?.error ? (
                <p className="mt-2 text-xs text-red-300">
                  Feed error: {data.error}
                </p>
              ) : null}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="truncate text-lg font-black uppercase tracking-[-0.04em] text-white">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  );
}

function CompactStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-black/45 px-3 py-3">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-xl font-black leading-none text-white">
        {value}
      </p>
    </div>
  );
}