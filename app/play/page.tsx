import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  const data = await getRTTData();
  const config = data.config;

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker={cfg(config, "play.kicker", "Next Battle")}
          tagline={cfg(config, "site.tagline", "NYC Street Table Tennis")}
          title={cfg(config, "play.title", "Show Up")}
          subtitle={cfg(
            config,
            "play.subtitle",
            "Join the next battle, get added to the board, and play tracked matches."
          )}
        />

        <section className="grid gap-3">
          <Link href="/join" className="rtt-cta">
            {cfg(config, "park.primaryCta", "Join Next Battle")}
          </Link>

          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/standings" className="rtt-secondary">
              {cfg(config, "park.secondaryCtaBoard", "View The Board")}
            </Link>

            <Link href="/live" className="rtt-secondary">
              {cfg(config, "park.secondaryCtaLive", "Watch Live")}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}