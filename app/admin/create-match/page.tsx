"use client";

import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { createMatch } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateMatchPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  const [playerAId, setPlayerAId] = useState("");
  const [playerBId, setPlayerBId] = useState("");
  const [type, setType] = useState("Street");
  const [table, setTable] = useState("Table 1");
  const [eventId, setEventId] = useState("EVT-001");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
    getRTTData().then((data) => {
      setPlayers(data.players);
      setPlayerAId(data.players[0]?.id || "");
      setPlayerBId(data.players[1]?.id || "");
      setEventId(data.payout?.eventId || "EVT-001");
    });
  }, [router]);

  async function submit() {
    setBusy(true);
    try {
      await createMatch({ eventId, type, table, playerAId, playerBId });
      alert("Battle created.");
      router.push("/admin/matches");
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  const playerOptions = players.map((p) => ({ label: `${p.id} — ${p.handle || p.name}`, value: p.id }));

  return (
    <AdminShell>
      <p className="rtt-kicker">Battle Builder</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Create Battle</h1>
      <div className="mt-6"><AdminNotice title="Battle Creation">Create scheduled matches here instead of adding rows in Google Sheets.</AdminNotice></div>
      <div className="mt-8 grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 md:grid-cols-2">
        <AdminField label="Event ID" value={eventId} onChange={setEventId} />
        <AdminField label="Table" value={table} onChange={setTable} />
        <AdminSelect label="Type" value={type} onChange={setType} options={["Street","Ranked","Final","Call Out"].map(v => ({label:v,value:v}))} />
        <div />
        <AdminSelect label="Player A" value={playerAId} onChange={setPlayerAId} options={playerOptions} />
        <AdminSelect label="Player B" value={playerBId} onChange={setPlayerBId} options={playerOptions} />
        <button disabled={busy || !playerAId || !playerBId || playerAId === playerBId} onClick={submit} className="rtt-cta md:col-span-2 disabled:opacity-50">{busy ? "Creating..." : "Create Battle"}</button>
      </div>
    </AdminShell>
  );
}
