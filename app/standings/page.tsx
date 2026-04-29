import Link from "next/link";
import { players } from "@/lib/mockData";

export default function StandingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Leaderboard</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Standings</h1>
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
        <div className="grid grid-cols-6 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
          <span>Rank</span><span>Player</span><span>Record</span><span>Points</span><span>Streak</span><span>Profile</span>
        </div>
        {players.map((p) => (
          <div key={p.id} className="grid grid-cols-6 items-center border-t border-white/10 px-4 py-4 text-sm">
            <span className="font-black text-rtt-red">#{p.rank}</span>
            <span className="font-black uppercase">{p.name}</span>
            <span>{p.wins}-{p.losses}</span>
            <span>{p.points}</span>
            <span>{p.streak}</span>
            <Link className="text-rtt-red underline" href={`/players/${p.id}`}>View</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
