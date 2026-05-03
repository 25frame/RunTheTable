"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { getRTTData, RTTPlayer } from "@/lib/googleData";
import { isAdmin } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  useEffect(() => { if (!isAdmin()) router.push("/admin/login"); getRTTData().then((data) => setPlayers(data.players)); }, [router]);
  return (
    <AdminShell>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Admin Roster</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Players</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {players.map((p) => (
          <div key={p.id} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">{p.id} · Rank #{p.rank}</p>
            <h2 className="mt-2 text-3xl font-black uppercase">{p.name}</h2>
            <p className="mt-1 text-white/50">{p.skill} · {p.handle}</p>
            <p className="mt-3 text-white/70">{p.wins}-{p.losses} · {p.points} points · Diff {p.pointDiff}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
