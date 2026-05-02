"use client";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") router.push("/admin/dashboard");
      else router.push(`/players/${user.playerId}/edit`);
    } catch (err) { alert(String(err)); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center px-5 text-white"><div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-black/70 p-8 shadow-2xl"><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Account Login</p><h1 className="mt-3 text-4xl font-black italic uppercase">RTT Login</h1><p className="mt-3 text-white/55">Admin and player accounts use the same login.</p><input className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/><input className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/><button disabled={busy} onClick={submit} className="mt-4 w-full rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em] disabled:opacity-50">{busy ? "Logging in..." : "Login"}</button></div></main>;
}
