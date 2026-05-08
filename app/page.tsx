import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getRTTData();
  const players = data?.players || [];
  const top = players.slice(0, 5);

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker="RTT NYC"
          title="Run The Table"
          subtitle="Scan in. Join the next battle. Get on the board."
        />

        <section className="grid gap-3">
          <Link href="/join" className="rtt-cta">
            Join Next Battle
          </Link>

          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/standings" className="rtt-secondary">
              View The Board
            </Link>

            <Link href="/live" className="rtt-secondary">
              Watch Live
            </Link>
          </div>
        </section>

        <section className="rtt-section">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">Live Players</p>

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

          <div className="grid">
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
              <EmptyState title="No players loaded yet." error={data?.error} />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function EmptyState({ title, error }: { title: string; error?: string }) {
  return (
    <div className="rtt-mobile-card">
      <p className="text-base font-black uppercase">{title}</p>

      {error ? (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-200">
          Feed error: {error}
        </p>
      ) : null}
    </div>
  );
}