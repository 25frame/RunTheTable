import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function ParkPage() {
  const data = await getRTTData();
  const config = data.config;

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker={cfg(config, "park.kicker", "Scan In")}
          tagline={cfg(config, "site.tagline", "NYC Street Table Tennis")}
          title={cfg(config, "park.title", "Table Check")}
          subtitle={cfg(
            config,
            "park.subtitle",
            "You found the table. Join the next battle and get added to the board."
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

        <section className="rtt-section rtt-mobile-card">
          <p className="rtt-mini-kicker">
            {cfg(config, "park.howItWorksKicker", "How It Works")}
          </p>

          <div className="mt-4 grid gap-4">
            <Step
              number="01"
              title={cfg(config, "park.step1Title", "Join")}
              text={cfg(
                config,
                "park.step1Text",
                "Add your name and contact info."
              )}
            />

            <Step
              number="02"
              title={cfg(config, "park.step2Title", "Play")}
              text={cfg(
                config,
                "park.step2Text",
                "Admin assigns you to a battle."
              )}
            />

            <Step
              number="03"
              title={cfg(config, "park.step3Title", "Climb")}
              text={cfg(
                config,
                "park.step3Text",
                "Verified results update the board."
              )}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-black/45 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red">
        {number}
      </p>

      <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em]">
        {title}
      </h2>

      <p className="mt-2 text-sm font-bold leading-6 text-white/50">
        {text}
      </p>
    </div>
  );
}