import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getRTTData();
  const config = data.config;
  const players = data?.players || [];
  const top = players.slice(0, 5);

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker={cfg(config, "home.kicker", "RTT NYC")}
          title={cfg(config, "home.title", "Run The Table")}
          subtitle={cfg(
            config,
            "home.subtitle",
            "Scan in. Join the next battle. Get on the board."
          )}
        />

        {/* PRIMARY WORKFLOW */}
        <section className="grid gap-3">
          <Link href="/park" className="rtt-cta">
            {cfg(config, "home.primaryCta", "Scan In / Join")}
          </Link>

          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/standings" className="rtt-secondary">
              {cfg(config, "home.secondaryCtaBoard", "View The Board")}
            </Link>

            <Link href="/live" className="rtt-secondary">
              {cfg(config, "home.secondaryCtaLive", "Watch Live")}
            </Link>
          </div>
        </section>

        {/* QUICK EXPLAINER */}
        <section className="rtt-section grid grid-cols-3 gap-2">
          <MiniStep number="01" label={cfg(config, "park.step1Title", "Join")} />
          <MiniStep number="02" label={cfg(config, "park.step2Title", "Play")} />
          <MiniStep number="03" label={cfg(config, "park.step3Title", "Climb")} />
        </section>

        {/* TOP BOARD */}
        <section className="rtt-section">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">
                {cfg(config, "home.livePlayersLabel", "Live Players")}
              </p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                {cfg(config, "home.topBoardTitle", "Top Board")}
              </h2>
            </div>

            <Link
              href="/standings"
              className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red"
            >
              {cfg(config, "home.fullBoardLink", "Full Board")}
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
              <EmptyState
                title={cfg(
                  config,
                  "home.emptyPlayers",
                  "No players loaded yet."
                )}
                error={data?.error}
              />
            )}
          </div>
        </section>

        {/* SECONDARY JOIN REMINDER */}
        <section className="rtt-section rtt-mobile-card">
          <p className="rtt-mini-kicker">
            {cfg(config, "home.joinReminderKicker", "At The Table?")}
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em]">
            {cfg(config, "home.joinReminderTitle", "Get in the next battle.")}
          </h2>

          <p className="mt-3 text-sm font-bold leading-6 text-white/50">
            {cfg(
              config,
              "home.joinReminderText",
              "Scan the QR code at the table or join directly from here."
            )}
          </p>

          <Link href="/join" className="rtt-cta mt-5 w-full">
            {cfg(config, "home.joinReminderButton", "Join Next Battle")}
          </Link>
        </section>
      </section>
    </main>
  );
}

function MiniStep({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red">
        {number}
      </p>

      <p className="mt-1 text-sm font-black uppercase tracking-[-0.03em] text-white/70">
        {label}
      </p>
    </div>
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