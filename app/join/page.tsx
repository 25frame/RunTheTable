"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase, SUPABASE_PHOTO_BUCKET } from "@/lib/supabaseClient";

export default function JoinPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function uploadPhoto(file: File) {
    const ext = file.name.split(".").pop() || "jpg";
    const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const path = `joins/${safeName}`;

    const { error } = await supabase.storage
      .from(SUPABASE_PHOTO_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(SUPABASE_PHOTO_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      let photoUrl = "";
      const file = form.get("photo") as File | null;

      if (file && file.size > 0) {
        photoUrl = await uploadPhoto(file);
      }

      const payload = {
        name: String(form.get("name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        instagram: String(form.get("instagram") || "").trim(),
        skill: String(form.get("skill") || "Beginner").trim(),
        notes: String(form.get("notes") || "").trim(),
        photo: photoUrl,
      };

      const res = await fetch("/api/rtt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join",
          payload,
        }),
      });

     const text = await res.text();
console.log("JOIN STATUS:", res.status);
console.log("JOIN RAW RESPONSE:", text);

if (!text || !text.trim()) {
  throw new Error(`Empty response from /api/rtt. HTTP status: ${res.status}`);
}

let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error(`Non-JSON response from /api/rtt: ${text.slice(0, 300)}`);
}

      if (!data.ok) {
        throw new Error(data.error || JSON.stringify(data));
      }

      setDone(true);
    } catch (err) {
      console.error("JOIN ERROR:", err);
      setError(err instanceof Error ? err.message : "Join failed.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="rtt-shell text-white">
        <section className="rtt-max">
          <p className="rtt-kicker">You’re In</p>
          <h1 className="rtt-title">
            Welcome
            <br />
            To RTT
          </h1>

          <div className="mt-8 rounded-[2rem] border border-green-400/30 bg-green-400/10 p-6">
            <h2 className="text-3xl font-black uppercase">Added to the board.</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Admin can now assign you to a battle.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <Link href="/live" className="rtt-cta">
              Watch Live
            </Link>
            <Link href="/standings" className="rtt-secondary">
              View Board
            </Link>
          </div>
        </section>
      </main>
    );
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

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input name="name" required placeholder="Name" className="rtt-input" />
          <input name="email" required type="email" placeholder="Email" className="rtt-input" />
          <input name="phone" placeholder="Phone" className="rtt-input" />
          <input name="instagram" placeholder="@handle" className="rtt-input" />

          <select name="skill" className="rtt-input">
            <option value="Beginner">Beginner</option>
            <option value="Rookie">Rookie</option>
            <option value="Challenger">Challenger</option>
            <option value="Contender">Contender</option>
            <option value="Killer">Killer</option>
          </select>

          <label className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white/60">
            <span className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Player Photo
            </span>
            <input type="file" name="photo" accept="image/*" className="mt-3 block w-full text-sm" />
          </label>

          <textarea name="notes" placeholder="Notes" className="min-h-32 rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none" />

          {error && (
            <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </p>
          )}

          <button disabled={loading} className="rtt-cta disabled:opacity-50">
            {loading ? "Joining..." : "Join RTT"}
          </button>
        </form>
      </section>
    </main>
  );
}