"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { adminAction } from "@/lib/adminApi";
import { getAdminKey, isAdmin } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!isAdmin()) router.push("/admin/login"); }, [router]);
  async function recalc() {
    setBusy(true);
    try { await adminAction("syncForm", getAdminKey(), {}); await adminAction("recalcStandings", getAdminKey(), {}); alert("Synced forms and recalculated standings."); }
    catch (err) { alert(String(err)); }
    finally { setBusy(false); }
  }
  return (
    <AdminShell>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">System Controls</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Settings</h1>
      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6">
        <h2 className="text-2xl font-black uppercase">Maintenance</h2>
        <p className="mt-2 text-white/55">Use this when form entries or scores need to be pulled into the site immediately.</p>
        <button disabled={busy} onClick={recalc} className="mt-6 rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em] disabled:opacity-50">{busy ? "Working..." : "Sync + Recalculate"}</button>
      </div>
    </AdminShell>
  );
}
