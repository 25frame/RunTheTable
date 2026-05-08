import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const data = await getRTTData();
  const config = data.config;
  const matches = data?.matches || [];

  const liveMatch =
    matches.find((m) => (m.status || "").toLowerCase() === "live") ||
    matches[0];

  const recent = matches.slice(0, 5);

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker={cfg(config, "live.kicker", "Live")}
          title={cfg(config, "live.title", "Watch Live")}
          subtitle={cfg(
            config,
            "live.subtitle",
            "Follow the current table and recent battles."
          )}
        />

        {liveMatch ? (
          <section className="rtt-section">
            <article className="rtt-mobile-card rtt-mobile-card-hot">
              <p className="rtt-mini-kicker">
                {liveMatch.status || "Scheduled"}
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em]">
                {liveMatch.playerA} vs {liveMatch.playerB}
              </h2>

              <p className="mt-5 text-7xl font-black leading-none text-rtt-red">
                {liveMatch.score}
              </p>

              <p className="mt-4 rtt-muted-line">
                {liveMatch.status || "Match"} / {liveMatch.table || "Table"}
              </p>
            </article>
          </section>
        ) : (
          <section className="rtt-section">
            <div className="rtt-mobile-card">
              <p className="font-black uppercase text-white/60">
                No live match yet.
              </p>
            </div>
          </section>
        )}

        <section className="rtt-section">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="rtt-mini-kicker">Recent</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                Receipts
              </h2>
            </div>

            <Link
              href="/results"
              className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red"
            >
              Results
            </Link>
          </div>

          <div className="rtt-list">
            {recent.length ? (
              recent.map((m) => (
                <Link
                  key={`${m.matchId}-${m.row}`}
                  href="/results"
                  className="rtt-mobile-card"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-xl font-black uppercase tracking-[-0.04em]">
                        {m.playerA} vs {m.playerB}
                      </p>

                      <p className="mt-1 rtt-muted-line">
                        {m.type || "Battle"} / {m.status || "Scheduled"}
                      </p>
                    </div>

                    <p className="shrink-0 text-2xl font-black text-rtt-red">
                      {m.score}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rtt-mobile-card">
                <p className="font-black uppercase text-white/60">
                  No recent matches yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}