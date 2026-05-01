"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { adminAction } from "@/lib/adminApi";
import { getAdminKey, isAdmin } from "@/lib/adminAuth";
import { getRTTData, RTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<RTTData | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!isAdmin()) router.push("/admin/login"); getRTTData().then(setData); }, [router]);

  async function syncNow() {
    setBusy(true);
    try {
      await adminAction("syncForm", getAdminKey(), {});
      await adminAction("recalcStandings", getAdminKey(), {});
      setData(await getRTTData());
      alert("Synced and recalculated.");
    } catch (err) { alert(String(err)); }
    finally { setBusy(false); }
  }

  return (
    <AdminShell>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Control Center</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <button onClick={() => router.push("/admin/matches")} className="rounded-[2rem] bg-rtt-red p-8 text-left text-2xl font-black uppercase shadow-2xl">Live Scoring<span className="mt-2 block text-sm font-bold normal-case text-white/70">Score matches point by point.</span></button>
        <button onClick={() => router.push("/admin/players")} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase">Players<span className="mt-2 block text-sm font-bold normal-case text-white/60">Review roster.</span></button>
        <button onClick={() => router.push("/live")} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase">Public Live<span className="mt-2 block text-sm font-bold normal-case text-white/60">Open scoreboard.</span></button>
        <button disabled={busy} onClick={syncNow} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase disabled:opacity-50">Sync Now<span className="mt-2 block text-sm font-bold normal-case text-white/60">Pull forms and recalc.</span></button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Players</p><p className="mt-2 text-4xl font-black">{data?.players.length || 0}</p></div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Matches</p><p className="mt-2 text-4xl font-black">{data?.matches.length || 0}</p></div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Prize Pool</p><p className="mt-2 text-4xl font-black">${data?.payout.prizePool || 0}</p></div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Winner</p><p className="mt-2 text-4xl font-black">{data?.payout.firstPlaceName || "TBD"}</p></div>
      </div>
    </AdminShell>
  );
}
