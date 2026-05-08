import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-static";

export default function ParkPage() {
  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker="Scan In"
          title="Table Check"
          subtitle="You found the table. Join the next battle and get added to the board."
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

        <section className="rtt-section rtt-mobile-card">
          <p className="rtt-mini-kicker">How It Works</p>

          <div className="mt-4 grid gap-4">
            <Step number="01" title="Join" text="Add your name and contact info." />
            <Step number="02" title="Play" text="Admin assigns you to a battle." />
            <Step number="03" title="Climb" text="Verified results update the board." />
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