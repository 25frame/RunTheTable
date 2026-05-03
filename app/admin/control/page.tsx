"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { authedPost, getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminControlPage() {
  const router = useRouter();
  const [data, setData] = useState<RTTData | null>(null);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
    getRTTData().then(setData);
  }, [router]);

  async function runAction(action: string, label: string) {
    setBusy(label);
    try {
      await authedPost(action, {});
      setData(await getRTTData());
      alert(`${label} complete.`);
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy("");
    }
  }

  return (
    <AdminShell>
      <p className="rtt-kicker">Sheets are background only</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Admin Control</h1>

      <div className="mt-6">
        <AdminNotice title="Super Admin Principle" tone="success">
          Use this portal as the operating interface. Google Sheets should only be used as the emergency database or advanced backend.
        </AdminNotice>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ControlButton title="Sync Form" text="Pull Google Form registrations into Players and Registrations." busy={busy} onClick={() => runAction("syncForm", "Sync Form")} />
        <ControlButton title="Recalculate Board" text="Rebuild standings, points, ranks, and payout assignments." busy={busy} onClick={() => runAction("recalcStandings", "Recalculate Board")} />
        <ControlButton title="Refresh View" text="Reload current public data from backend." busy={busy} onClick={async () => setData(await getRTTData())} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Competitors" value={data?.players.length || 0} />
        <Metric label="Battles" value={data?.matches.length || 0} />
        <Metric label="Current King" value={data?.players[0]?.handle || data?.players[0]?.name || "TBD"} />
        <Metric label="Updated" value={data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : "-"} />
      </div>
    </AdminShell>
  );
}

function ControlButton({ title, text, busy, onClick }: { title: string; text: string; busy: string; onClick: () => void }) {
  return (
    <button disabled={Boolean(busy)} onClick={onClick} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 text-left transition active:scale-[0.985] disabled:opacity-50">
      <h2 className="text-2xl font-black uppercase">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-rtt-red">{busy === title ? "Working..." : "Run"}</p>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
