"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function fetchRTTData(): Promise<RTTData> {
  const response = await fetch("/api/rtt", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load RTT data: HTTP ${response.status}`);
  }

  return (await response.json()) as RTTData;
}

export default function AdminPlayersPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshPlayers() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchRTTData();
      setPlayers(data.players || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load players.");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    refreshPlayers();
  }, [router]);

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="rtt-mini-kicker">Admin Roster</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Players
          </h1>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/create-player")}
          className="shrink-0 rounded-full bg-rtt-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] md:px-5 md:text-xs"
        >
          Add
        </button>
      </div>

      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Players" value={players.length} />
        <Metric
          label="King"
          value={players[0]?.handle || players[0]?.name || "TBD"}
        />
        <Metric label="Top Pts" value={players[0]?.points ?? 0} />
        <Metric
          label="Loaded"
          value={loading ? "..." : error ? "Error" : "Yes"}
        />
      </section>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {loading ? (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-white/50 md:rounded-[2rem]">
            Loading players...
          </div>
        ) : players.length ? (
          players.map((p, index) => (
            <PlayerAdminCard
              key={p.id}
              player={p}
              isKing={index === 0}
              onView={() => router.push(`/players/${p.id}`)}
              onEdit={() => router.push(`/players/${p.id}/edit`)}
            />
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-white/50 md:rounded-[2rem]">
            No players loaded.
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function PlayerAdminCard({
  player,
  isKing,
  onView,
  onEdit,
}: {
  player: RTTPlayer;
  isKing: boolean;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <article
      className={
        isKing
          ? "rounded-[1.5rem] border border-rtt-red/40 bg-rtt-red/10 p-5 md:rounded-[2rem]"
          : "rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rtt-red md:text-xs">
            {player.id} / Rank #{player.rank}
          </p>

          <h2 className="mt-2 truncate text-2xl font-black uppercase tracking-[-0.05em] md:text-3xl">
            {player.handle || player.name}
          </h2>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/40">
            {player.skill || "Unranked"} / {player.wins}W {player.losses}L /{" "}
            {player.points} pts
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-3xl font-black text-rtt-red">{player.points}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            pts
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <SmallStat label="Wins" value={player.wins} />
        <SmallStat label="Losses" value={player.losses} />
        <SmallStat label="Diff" value={player.pointDiff} />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full bg-rtt-red px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onView}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/70"
        >
          View
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[1.5rem]">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40 md:text-[10px]">
        {label}
      </p>

      <p className="mt-2 truncate text-xl font-black uppercase tracking-[-0.04em] md:text-2xl">
        {value}
      </p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/45 px-3 py-3">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-xl font-black leading-none text-white">
        {value}
      </p>
    </div>
  );
}