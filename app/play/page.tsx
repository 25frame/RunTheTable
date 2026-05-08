import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-static";

export default function PlayPage() {
  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker="Next Battle"
          title="Show Up"
          subtitle="Join the next battle, get added to the board, and play tracked matches."
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
      </section>
    </main>
  );
}