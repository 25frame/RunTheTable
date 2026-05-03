import { getRTTData } from "@/lib/googleData";
import Link from "next/link";

export default async function PlayPage() {
  const { formUrl } = await getRTTData();

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Next Battle</p>
        <h1 className="rtt-title">SHOW<br />UP</h1>
        <p className="rtt-subtitle">
          Sign up, get on the board, and play tracked battles.
        </p>

        <div className="mt-8 grid gap-3">
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="rtt-cta">
            Join Next Battle
          </a>
          <Link href="/standings" className="rtt-secondary">
            View The Board
          </Link>
        </div>
      </section>
    </main>
  );
}
