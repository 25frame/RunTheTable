"use client";

import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { createPlayer, createUser } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatePlayerPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [skill, setSkill] = useState("Unranked");
  const [password, setPassword] = useState("");
  const [createLogin, setCreateLogin] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
  }, [router]);

  async function submit() {
    setBusy(true);
    try {
      const result = await createPlayer({ displayName, fullName, email, phone, instagram, skill, status: "Active" });
      const playerId = String(result.playerId || "");
      if (createLogin && email && password && playerId) {
        await createUser({ email, password, role: "player", playerId });
      }
      alert(`Player created: ${playerId}`);
      router.push("/admin/players");
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <p className="rtt-kicker">No Sheet Needed</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Create Player</h1>
      <div className="mt-6"><AdminNotice title="Recommended Flow">Create player here when you do not want to wait for Google Form sync.</AdminNotice></div>
      <div className="mt-8 grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 md:grid-cols-2">
        <AdminField label="Display Name" value={displayName} onChange={setDisplayName} />
        <AdminField label="Full Name" value={fullName} onChange={setFullName} />
        <AdminField label="Email" value={email} onChange={setEmail} />
        <AdminField label="Phone" value={phone} onChange={setPhone} />
        <AdminField label="Instagram / Handle" value={instagram} onChange={setInstagram} />
        <AdminSelect label="Tier / Skill" value={skill} onChange={setSkill} options={["Unranked","Rookie","Challenger","Contender","Killer"].map(v => ({label:v,value:v}))} />
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 md:col-span-2">
          <input type="checkbox" checked={createLogin} onChange={(e) => setCreateLogin(e.target.checked)} />
          <span className="text-sm font-bold uppercase tracking-[0.12em]">Create player login account</span>
        </label>
        {createLogin && <AdminField label="Temporary Password" value={password} onChange={setPassword} />}
        <button disabled={busy || !displayName} onClick={submit} className="rtt-cta md:col-span-2 disabled:opacity-50">{busy ? "Creating..." : "Create Player"}</button>
      </div>
    </AdminShell>
  );
}
