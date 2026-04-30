import Link from "next/link";
import { getRTTData } from "@/lib/googleData";

export default async function StandingsPage() {
  const { players } = await getRTTData();
  const sorted = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Live Google Sheet</p>
      <h1 className="mt-3 text-6xl font-black italic uppercase">Standings</h1>
      <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/45">
        <div className="grid grid-cols-6 bg-rtt-red px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">
          <span>Rank</span><span>Player</span><span>Record</span><span>Points</span><span>Streak</span><span>Profile</span>
        </div>
        {sorted.map((p) => (
          <div key={p.id} className="grid grid-cols-6 items-center border-t border-white/10 px-4 py-4 text-sm odd:bg-white/[0.03]">
            <span className="font-black text-rtt-red">#{p.rank}</span>
            <span className="font-black uppercase">{p.name}</span>
            <span>{p.wins}-{p.losses}</span>
            <span>{p.points}</span>
            <span>{p.streak}</span>
            <Link className="font-bold text-rtt-red underline" href={`/players/${p.id}`}>View</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
