"use client";
import { useState } from "react";
import { login } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-black/70 p-8 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Private</p>
        <h1 className="mt-3 text-4xl font-black italic uppercase">Admin Login</h1>
        <p className="mt-3 text-white/55">Enter the RTT admin password to score matches and manage live play.</p>
        <input className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Admin password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="mt-4 w-full rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em]" onClick={() => { if (login(password)) router.push("/admin/dashboard"); else alert("Wrong password"); }}>Login</button>
      </div>
    </main>
  );
}
