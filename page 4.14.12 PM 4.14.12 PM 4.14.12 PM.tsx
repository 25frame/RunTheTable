import Link from "next/link";
import { RulesSwipeCards } from "@/components/RulesSwipeCards";

export default function RulesPage() {
  return (
    <main className="rtt-shell overflow-hidden text-white">
      <section className="rtt-max relative">
        <div className="pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full bg-rtt-red/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-80 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

        <p className="rtt-kicker">Know the game</p>
        <h1 className="rtt-title">
          RTT<br />RULES
        </h1>

        <p className="rtt-subtitle">
          Fast rules. Street code. No confusion.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <QuickStat label="Game" value="11" />
          <QuickStat label="Win By" value="2" />
        </div>

        <RulesSwipeCards />

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
            Full official reference
          </p>
          <a
            href="https://www.pongfit.org/official-rules-of-table-tennis"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-2xl bg-rtt-red px-5 py-3 text-xs font-black uppercase tracking-[0.18em]"
          >
            View Official Rules
          </a>
        </div>

        <Link href="/live" className="rtt-cta mt-5 w-full">
          Back to Live Battle
        </Link>
      </section>
    </main>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/45 p-5 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-5xl font-black italic text-rtt-red">{value}</p>
    </div>
  );
}
