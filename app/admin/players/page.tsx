"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<RTTPlayer[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
    getRTTData().then((data) => setPlayers(data.players));
  }, [router]);

  return (
    <AdminShell>
      <p className="rtt-kicker">Admin Roster</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Players</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {players.map((p) => (
          <div key={p.id} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">{p.id} / Rank #{p.rank}</p>
            <h2 className="mt-2 text-3xl font-black uppercase">{p.handle || p.name}</h2>
            <p className="mt-1 text-white/50">{p.skill} / {p.wins}W {p.losses}L</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => router.push(`/players/${p.id}/edit`)} className="rounded-full bg-rtt-red px-4 py-2 text-xs font-black uppercase">Edit</button>
              <button onClick={() => router.push(`/players/${p.id}`)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase">View</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
