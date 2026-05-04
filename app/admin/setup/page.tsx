"use client";

import { AdminField } from "@/components/admin/AdminField";
import { AdminShell } from "@/components/admin/AdminShell";
import { updatePayoutConfig, updateSetup } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import { getRTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSetupPage() {
  const router = useRouter();

  const [activeEventId, setActiveEventId] = useState("EVT-001");
  const [winPoints, setWinPoints] = useState(3);
  const [lossPoints, setLossPoints] = useState(1);
  const [totalCollected, setTotalCollected] = useState(0);
  const [operationsCut, setOperationsCut] = useState(0);
  const [prizePool, setPrizePool] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    getRTTData().then((data) => {
      const payout = data.payout;

      setActiveEventId(payout?.eventId || "EVT-001");
      setTotalCollected(payout?.totalCollected || 0);
      setOperationsCut(payout?.operationsCut || 0);
      setPrizePool(payout?.prizePool || 0);
    });
  }, [router]);

  async function saveAll() {
    setBusy(true);

    try {
      await updateSetup({
        activeEventId,
        winPoints,
        lossPoints,
      });

      await updatePayoutConfig({
        eventId: activeEventId,
        totalCollected,
        operationsCut,
        prizePool,
      });

      alert("Setup saved.");
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <p className="rtt-kicker">Private Backend Settings</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Setup</h1>

      <div className="mt-8 grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 md:grid-cols-2">
        <AdminField
          label="Active Event ID"
          value={activeEventId}
          onChange={setActiveEventId}
        />

        <AdminField
          label="Win Points"
          value={winPoints}
          type="number"
          onChange={(v) => setWinPoints(Number(v) || 0)}
        />

        <AdminField
          label="Loss Points"
          value={lossPoints}
          type="number"
          onChange={(v) => setLossPoints(Number(v) || 0)}
        />

        <AdminField
          label="Total Collected"
          value={totalCollected}
          type="number"
          onChange={(v) => setTotalCollected(Number(v) || 0)}
        />

        <AdminField
          label="Operations Cut"
          value={operationsCut}
          type="number"
          onChange={(v) => setOperationsCut(Number(v) || 0)}
        />

        <AdminField
          label="Prize Pool"
          value={prizePool}
          type="number"
          onChange={(v) => setPrizePool(Number(v) || 0)}
        />

        <button
          disabled={busy}
          onClick={saveAll}
          className="rtt-cta md:col-span-2 disabled:opacity-50"
        >
          {busy ? "Saving..." : "Save Setup"}
        </button>
      </div>
    </AdminShell>
  );
}