"use client";

import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { createUser } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "player">("player");
  const [playerId, setPlayerId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
    getRTTData().then((data) => {
      setPlayers(data.players);
      setPlayerId(data.players[0]?.id || "");
    });
  }, [router]);

  async function submit() {
    setBusy(true);
    try {
      await createUser({ email, password, role, playerId: role === "player" ? playerId : "" });
      alert("User created.");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <p className="rtt-kicker">Access Control</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Users</h1>
      <div className="mt-6"><AdminNotice title="Access Rule" tone="warning">Admin accounts control the system. Player accounts edit only their linked profile.</AdminNotice></div>
      <div className="mt-8 grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 md:grid-cols-2">
        <AdminField label="Email" value={email} onChange={setEmail} />
        <AdminField label="Password" value={password} onChange={setPassword} />
        <AdminSelect label="Role" value={role} onChange={(v) => setRole(v as "admin" | "player")} options={[{label:"Player",value:"player"},{label:"Admin",value:"admin"}]} />
        {role === "player" && <AdminSelect label="Linked Player" value={playerId} onChange={setPlayerId} options={players.map((p) => ({ label: `${p.id} — ${p.handle || p.name}`, value: p.id }))} />}
        <button disabled={busy || !email || !password} onClick={submit} className="rtt-cta md:col-span-2 disabled:opacity-50">{busy ? "Creating..." : "Create User"}</button>
      </div>
    </AdminShell>
  );
}
