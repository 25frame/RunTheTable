import { PlayerCard } from "@/components/PlayerCard";
import { getRTTData } from "@/lib/googleData";
export default async function PlayersPage() {
  const { players } = await getRTTData();
  return <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-white"><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Roster</p><h1 className="mt-3 text-6xl font-black italic uppercase">Players</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{players.map((player)=><PlayerCard key={player.id} player={player}/>)}</div></main>;
}
