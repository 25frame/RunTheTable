import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const data = await getRTTData();
  const config = data.config;
  const players = data?.players || [];

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker={cfg(config, "standings.kicker", "Board")}
          tagline={cfg(config, "site.tagline", "NYC Street Table Tennis")}
          title={cfg(config, "standings.title", "The Board")}
          subtitle={cfg(
            config,
            "standings.subtitle",
            "Rankings update after verified battles."
          )}
        />

        <section className="grid grid-cols-3 gap-2">
          <MiniStat label="Players" value={players.length} />
          <MiniStat
            label="King"
            value={players[0]?.handle || players[0]?.name || "Open"}
          />
          <MiniStat label="Top Pts" value={players[0]?.points ?? 0} />
        </section>

        <section className="rtt-section rtt-list">
          {players.length ? (
            players.map((p, index) => {
              const isKing = index === 0;

              return (
                <Link
                  key={p.id}
                  href={`/players/${p.id}`}
                  className={
                    isKing
                      ? "rtt-mobile-card rtt-mobile-card-hot"
                      : "rtt-mobile-card"
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
                        <h2 className="truncate text-2xl font-black uppercase tracking-[-0.05em]">
                          {p.handle || p.name}
                        </h2>

                        <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                          {p.skill || "Unranked"} · {p.wins}W / {p.losses}L
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
            <EmptyState
              title={cfg(config, "standings.empty", "No standings loaded.")}
              error={data?.error}
            />
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

function EmptyState({ title, error }: { title: string; error?: string }) {
  return (
    <div className="rtt-mobile-card">
      <p className="font-black uppercase text-white/60">{title}</p>

      {error ? (
        <p className="mt-2 text-xs text-red-300">Feed error: {error}</p>
      ) : null}
    </div>
  );
}