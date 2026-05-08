import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const matches = data?.matches || [];

  const top = players.slice(0, 5);
  const king = players[0];
  const latestMatch = matches[0];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        {/* HERO */}
        <section className="pt-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.6rem] bg-rtt-red shadow-[0_0_36px_rgba(255,0,0,0.35)]">
              <span className="-skew-x-12 text-4xl font-black italic text-white">
                R
              </span>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-rtt-red">
                NYC Street Table Tennis
              </p>

              <p className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-white/40">
                Live board · verified battles · street rules
              </p>
            </div>
          </div>

          <h1 className="rtt-title mt-4">
            Run The
            <br />
            Table
          </h1>

          <p className="rtt-subtitle mt-6 max-w-3xl">
            Scan in. Get ranked. Battle live. Climb the board.
          </p>

          <div className="mt-8 grid gap-3">
            <Link href="/park" className="rtt-cta">
              Get Ranked
            </Link>

            <Link href="/join" className="rtt-secondary">
              Join Next Battle
            </Link>

            <Link href="/live" className="rtt-secondary">
              Watch Live
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <InfoPill label="Format" value="Battles to 11" />
            <InfoPill label="Board" value="Live Ranking" />
            <InfoPill label="Results" value="Verified Wins" />
            <InfoPill label="Rule" value="Winner Climbs" />
          </div>
        </section>

        {/* BOARD STATUS */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_0_40px_rgba(255,0,0,0.08)]">
          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">
                Board Status
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
                {king ? `${king.handle || king.name} holds #1` : "Open Board"}
              </h2>

              <p className="mt-2 text-sm font-bold leading-6 text-white/50">
                Players enter the board, report verified battles, and move up
                through wins, points, and table pressure.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <MiniMetric label="Players" value={players.length} />
              <MiniMetric label="Battles" value={matches.length} />
              <MiniMetric label="King" value={king ? "#1" : "—"} />
            </div>
          </div>
        </section>

        {/* TOP BOARD */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="rtt-kicker">Live Players</p>

              <h2 className="mt-1 text-4xl font-black uppercase tracking-[-0.06em]">
                Top Board
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
                const displayName = p.handle || p.name;
                const isKing = index === 0;

                return (
                  <Link
                    key={p.id}
                    href={`/players/${p.id}`}
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 transition hover:border-rtt-red hover:bg-white/[0.075]"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={
                            isKing
                              ? "grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-rtt-red text-lg font-black text-white shadow-[0_0_30px_rgba(255,0,0,0.35)]"
                              : "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-lg font-black text-white"
                          }
                        >
                          {isKing ? (
                            <span className="-skew-x-12 text-2xl italic">R</span>
                          ) : (
                            `#${p.rank || index + 1}`
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-2xl font-black uppercase tracking-[-0.04em] group-hover:text-rtt-red">
                              {displayName}
                            </p>

                            {isKing ? (
                              <span className="rounded-full bg-rtt-red px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                                King
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/40">
                            Rank #{p.rank || index + 1} · {p.skill || "Unranked"} ·{" "}
                            {p.wins}W / {p.losses}L · Diff {p.pointDiff}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-4xl font-black text-rtt-red">
                          {p.points}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                          points
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

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Once players join or the board syncs, the top competitors
                  will appear here.
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

        {/* LATEST BATTLE */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="rtt-kicker">Receipts</p>

              <h2 className="mt-1 text-4xl font-black uppercase tracking-[-0.06em]">
                Latest Battle
              </h2>
            </div>

            <Link
              href="/results"
              className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red transition hover:text-white"
            >
              Results
            </Link>
          </div>

          {latestMatch ? (
            <Link
              href="/results"
              className="block rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-6 transition hover:border-rtt-red"
            >
              <div className="flex items-center justify-between gap-5">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">
                    {latestMatch.status || "Scheduled"}
                  </p>

                  <h3 className="mt-2 truncate text-3xl font-black uppercase tracking-[-0.04em]">
                    {latestMatch.playerA} vs {latestMatch.playerB}
                  </h3>

                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-white/40">
                    {latestMatch.type || "Battle"} ·{" "}
                    {latestMatch.table || "Table"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-5xl font-black text-rtt-red">
                    {latestMatch.score}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                    score
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 text-white/45">
              No battles posted yet.
            </div>
          )}
        </section>

        {/* FINAL CTA */}
        <section className="mt-12 rounded-[2rem] border border-rtt-red/30 bg-rtt-red p-6 text-black">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-black">
            <span className="-skew-x-12 text-3xl font-black italic text-white">
              R
            </span>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.22em]">
            Think you can climb?
          </p>

          <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.06em]">
            Step to the table.
          </h2>

          <p className="mt-2 text-sm font-black uppercase tracking-[0.1em] opacity-70">
            Join the board. Call your shot. Leave with receipts.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Link
              href="/join"
              className="rounded-full bg-black px-6 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white"
            >
              Join Next Battle
            </Link>

            <Link
              href="/standings"
              className="rounded-full border border-black/25 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              View The Board
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red">
        {label}
      </p>

      <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-white/75">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-2xl font-black text-rtt-red">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
    </div>
  );
}