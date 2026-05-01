"use client";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  useEffect(() => { if (!isAdmin()) router.push("/admin/login"); }, [router]);

  return (
    <AdminShell>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Control Center</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <button onClick={() => router.push("/admin/matches")} className="rounded-[2rem] bg-rtt-red p-8 text-left text-2xl font-black uppercase shadow-2xl">Live Scoring<span className="mt-2 block text-sm font-bold normal-case text-white/70">Score matches point by point.</span></button>
        <button onClick={() => router.push("/live")} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase">Public Live<span className="mt-2 block text-sm font-bold normal-case text-white/60">Open player-facing live scoreboard.</span></button>
        <button onClick={() => router.push("/standings")} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase">Standings<span className="mt-2 block text-sm font-bold normal-case text-white/60">Review updated rankings.</span></button>
      </div>
    </AdminShell>
  );
}
