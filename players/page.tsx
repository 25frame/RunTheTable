import { PlayerIdentityCard } from "@/components/PlayerIdentityCard";
import { getRTTData } from "@/lib/googleData";

export default async function PlayersPage() {
  const { players, matches } = await getRTTData();

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Competitors</p>
        <h1 className="rtt-title">THE<br />CREW</h1>
        <p className="rtt-subtitle">Every name on the board can be called out.</p>
        <div className="mt-8 grid gap-3">
          {players.map((player) => {
            const liveMatch = matches.find((m) => (m.status || "").toLowerCase() === "live" && (m.playerAId === player.id || m.playerBId === player.id));
            return <PlayerIdentityCard key={player.id} player={player} liveMatch={liveMatch} />;
          })}
        </div>
      </section>
    </main>
  );
}
