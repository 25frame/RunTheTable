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

      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(`/players/${user.playerId}/edit`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="rtt-shell flex items-center justify-center text-white">
      <section className="rtt-card w-full max-w-md p-7">
        <p className="rtt-kicker">Account Login</p>
        <h1 className="mt-3 text-5xl font-black italic uppercase tracking-[-0.08em]">RTT Login</h1>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.08em] text-white/50">
          Admins run the system. Competitors own their profile.
        </p>

        <input
          className="mt-6 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={busy}
          onClick={submit}
          className="rtt-cta mt-5 w-full disabled:opacity-50"
        >
          {busy ? "Entering..." : "Login"}
        </button>
      </section>
    </main>
  );
}
