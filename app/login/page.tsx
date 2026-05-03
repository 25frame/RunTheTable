"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/players");
      }
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Access</p>

        <h1 className="rtt-title">
          LOGIN
        </h1>

        <div className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl bg-black px-4 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl bg-black px-4 py-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="rtt-cta"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </section>
    </main>
  );
}