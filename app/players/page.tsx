import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const data = await getRTTData();
  const players = data?.players || [];

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker="Crew"
          title="The Crew"
          subtitle="Every player on the table. Every name can be called out."
        />

        <section className="rtt-section rtt-list">
          {players.length ? (
            players.map((p) => (
              <Link
                key={p.id}
                href={`/players/${p.id}`}
                className="rtt-mobile-card"
              >
                <p className="rtt-mini-kicker">
                  {p.id} / Rank #{p.rank}
                </p>

                <h2 className="mt-3 truncate text-2xl font-black uppercase tracking-[-0.05em]">
                  {p.handle || p.name}
                </h2>

                <p className="mt-2 rtt-muted-line">
                  {p.skill || "Unranked"} / {p.wins}W {p.losses}L /{" "}
                  {p.points} pts
                </p>
              </Link>
            ))
          ) : (
            <EmptyState title="No players loaded." error={data?.error} />
          )}
        </section>
      </section>
    </main>
  );
}

function EmptyState({ title, error }: { title: string; error?: string }) {
  return (
    <div className="rtt-mobile-card">
      <p className="font-black uppercase text-white/60">{title}</p>

      {error ? (
        <p className="mt-2 text-xs text-red-300">Feed error: {error}</p>
      ) : null}
    </div>
  );
}