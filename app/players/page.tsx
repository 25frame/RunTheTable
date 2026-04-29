import { PlayerCard } from "@/components/PlayerCard";
import { players } from "@/lib/mockData";

export default function PlayersPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Competitors</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Players</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {players.map((player) => <PlayerCard key={player.id} player={player} />)}
      </div>
    </main>
  );
}
