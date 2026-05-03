"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminHealthCheck, AdminHealth } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminHealthPage() {
  const router = useRouter();
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true);
    try {
      setHealth(await adminHealthCheck());
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
    check();
  }, [router]);

  return (
    <AdminShell>
      <p className="rtt-kicker">System Diagnostics</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Health</h1>

      <div className="mt-6">
        <AdminNotice title="Purpose" tone="info">
          Use this page to confirm the backend tabs exist and the Apps Script API is responding correctly.
        </AdminNotice>
      </div>

      <button disabled={busy} onClick={check} className="rtt-cta mt-6 disabled:opacity-50">
        {busy ? "Checking..." : "Run Health Check"}
      </button>

      {health && (
        <div className="mt-8 grid gap-3">
          {health.tabs.map((tab) => (
            <div key={tab.name} className={`rounded-2xl border p-4 ${tab.exists ? "border-green-400/25 bg-green-400/10" : "border-red-400/25 bg-red-400/10"}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-black uppercase">{tab.name}</p>
                  <p className="text-sm text-white/55">Rows: {tab.rows} / Columns: {tab.columns}</p>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em]">{tab.exists ? "OK" : "Missing"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
