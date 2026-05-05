"use client";

import { useState } from "react";

export default function JoinPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      // 🔥 Upload photo to Supabase (or skip if empty)
      let photoUrl = "";

      const file = form.get("photo") as File;

      if (file && file.size > 0) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: file,
        });

        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }

      const payload = {
        name: String(form.get("name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        instagram: String(form.get("instagram") || "").trim(),
        skill: String(form.get("skill") || "Beginner"),
        notes: String(form.get("notes") || "").trim(),
        photo: photoUrl,
      };

      const res = await fetch("/api/rtt", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "join",
          payload,
        }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.error);

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Join failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return <div className="p-10 text-white text-3xl">You’re in.</div>;
  }

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <h1 className="rtt-title">Join RTT</h1>

        <form onSubmit={submit} className="mt-8 grid gap-4">

          <input name="name" required placeholder="Name" className="rtt-input" />
          <input name="email" required type="email" placeholder="Email" className="rtt-input" />

          {/* ✅ NEW */}
          <input name="phone" placeholder="Phone" className="rtt-input" />

          <input name="instagram" placeholder="@handle" className="rtt-input" />

          <select name="skill" className="rtt-input">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          {/* ✅ PHOTO UPLOAD */}
          <input type="file" name="photo" accept="image/*" className="rtt-input" />

          <textarea name="notes" placeholder="Notes" className="rtt-input" />

          {error && <p className="text-red-400">{error}</p>}

          <button className="rtt-cta">
            {loading ? "Joining..." : "Join"}
          </button>

        </form>
      </section>
    </main>
  );
}