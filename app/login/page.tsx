"use client";

import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = Boolean(email.trim()) && Boolean(password.trim()) && !busy;

  async function submit() {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      if (user.playerId) {
        router.push(`/players/${user.playerId}/edit`);
        return;
      }

      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && canSubmit) {
      submit();
    }
  }

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner flex min-h-[calc(100vh-9rem)] items-center justify-center">
        <section className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl md:rounded-[2rem] md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rtt-red text-2xl font-black italic">
              <span className="-skew-x-12">R</span>
            </div>

            <div className="min-w-0">
              <p className="rtt-mini-kicker">Account Login</p>

              <h1 className="mt-1 text-3xl font-black italic uppercase leading-none tracking-[-0.06em]">
                RTT Login
              </h1>
            </div>
          </div>

          <p className="text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/50">
            Admins run the system. Competitors own their profile.
          </p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                Email
              </span>

              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-rtt-red"
                placeholder="admin@rttnyc.com"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                Password
              </span>

              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-rtt-red"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="rtt-cta mt-2 w-full disabled:opacity-50"
            >
              {busy ? "Entering..." : "Login"}
            </button>
          </div>

          <p className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
            Run The Table / Control Access
          </p>
        </section>
      </section>
    </main>
  );
}