"use client";

import { useState } from "react";

export default function JoinPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      instagram: String(form.get("instagram") || "").trim(),
      skill: String(form.get("skill") || "Beginner"),
      notes: String(form.get("notes") || "").trim(),
    };

    try {
      const res = await fetch("/api/rtt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", payload }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Join failed");

      setDone(true);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Join</p>

        <h1 className="rtt-title">
          Get On
          <br />
          The Board
        </h1>

        {!done ? (
          <form onSubmit={submit} className="mt-8 grid gap-4">
            <input name="name" placeholder="Name" required className="rtt-input" />
            <input name="email" placeholder="Email" required className="rtt-input" />
            <input name="instagram" placeholder="@handle (optional)" className="rtt-input" />

            <select name="skill" className="rtt-input">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <textarea name="notes" placeholder="Notes (optional)" className="rtt-input" />

            <button disabled={loading} className="rtt-cta">
              {loading ? "Joining..." : "Join"}
            </button>

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </form>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-green-400/30 bg-green-400/10 p-6">
            <h2 className="text-2xl font-black uppercase">You're In</h2>
            <p className="mt-2 text-white/70">
              You’ve been added to the board. Wait for admin to assign your first match.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}