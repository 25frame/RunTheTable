"use client";

import { AdminField } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
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
  const [firstPlacePayout, setFirstPlacePayout] = useState(0);
  const [secondPlacePayout, setSecondPlacePayout] = useState(0);
  const [thirdPlacePayout, setThirdPlacePayout] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
    getRTTData().then((data) => {
      setActiveEventId(data.payout.eventId || "EVT-001");
      setTotalCollected(data.payout.totalCollected || 0);
      setOperationsCut(data.payout.operationsCut || 0);
      setPrizePool(data.payout.prizePool || 0);
      setFirstPlacePayout(data.payout.firstPlacePayout || 0);
      setSecondPlacePayout(data.payout.secondPlacePayout || 0);
      setThirdPlacePayout(data.payout.thirdPlacePayout || 0);
    });
  }, [router]);

  async function saveSetup() {
    setBusy(true);
    try {
      await updateSetup({ activeEventId, winPoints, lossPoints });
      alert("Setup saved.");
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  async function savePayout() {
    setBusy(true);
    try {
      await updatePayoutConfig({ eventId: activeEventId, totalCollected, operationsCut, prizePool, firstPlacePayout, secondPlacePayout, thirdPlacePayout });
      alert("Private payout config saved.");
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
      <div className="mt-6"><AdminNotice title="Public UI Note" tone="warning">Public site uses no-money language. Payout settings are private admin/backend only.</AdminNotice></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black uppercase">Event / Ranking</h2>
          <div className="mt-5 grid gap-4">
            <AdminField label="Active Event ID" value={activeEventId} onChange={setActiveEventId} />
            <AdminField label="Win Points" value={winPoints} type="number" onChange={(v) => setWinPoints(Number(v))} />
            <AdminField label="Loss Points" value={lossPoints} type="number" onChange={(v) => setLossPoints(Number(v))} />
            <button disabled={busy} onClick={saveSetup} className="rtt-cta disabled:opacity-50">Save Setup</button>
          </div>
        </section>
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black uppercase">Private Payout Config</h2>
          <div className="mt-5 grid gap-4">
            <AdminField label="Total Collected" value={totalCollected} type="number" onChange={(v) => setTotalCollected(Number(v))} />
            <AdminField label="Operations Cut" value={operationsCut} type="number" onChange={(v) => setOperationsCut(Number(v))} />
            <AdminField label="Prize Pool" value={prizePool} type="number" onChange={(v) => setPrizePool(Number(v))} />
            <AdminField label="First Place" value={firstPlacePayout} type="number" onChange={(v) => setFirstPlacePayout(Number(v))} />
            <AdminField label="Second Place" value={secondPlacePayout} type="number" onChange={(v) => setSecondPlacePayout(Number(v))} />
            <AdminField label="Third Place" value={thirdPlacePayout} type="number" onChange={(v) => setThirdPlacePayout(Number(v))} />
            <button disabled={busy} onClick={savePayout} className="rtt-cta disabled:opacity-50">Save Private Payout Config</button>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
