"use client";

import { useState } from "react";

export default function JoinPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    skill: "Beginner",
    notes: "",
    photo: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // 🔥 (OPTIONAL) Supabase upload placeholder
  async function handlePhotoUpload(file: File) {
    try {
      // 👉 replace with your real Supabase upload later
      // for now just fake preview
      const url = URL.createObjectURL(file);
      update("photo", url);
    } catch (e) {
      console.error(e);
      setError("Photo upload failed");
    }
  }

  async function submit() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rtt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "join",
          payload: form
        })
      });

      const text = await res.text();
      console.log("JOIN RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned non-JSON: " + text.slice(0, 200));
      }

      if (!data.ok) {
throw new Error(data.error || JSON.stringify(data));
      }

      setDone(true);
    } catch (err) {
      console.error("JOIN ERROR:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase">You’re In</h1>
          <p className="mt-3 text-white/60">See you at the table.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white max-w-2xl mx-auto">
      <h1 className="text-5xl font-black italic uppercase">Join</h1>

      <div className="mt-8 grid gap-4">

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="rtt-input"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="rtt-input"
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="rtt-input"
        />

        <input
          placeholder="Instagram"
          value={form.instagram}
          onChange={(e) => update("instagram", e.target.value)}
          className="rtt-input"
        />

        <select
          value={form.skill}
          onChange={(e) => update("skill", e.target.value)}
          className="rtt-input"
        >
          <option>Beginner</option>
          <option>Rookie</option>
          <option>Challenger</option>
          <option>Contender</option>
          <option>Killer</option>
        </select>

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="rtt-input"
        />

        {/* PHOTO */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handlePhotoUpload(e.target.files[0]);
            }
          }}
          className="rtt-input"
        />

        {form.photo && (
          <img
            src={form.photo}
            alt="preview"
            className="w-32 h-32 object-cover rounded-xl border border-white/10"
          />
        )}

        {error && (
          <div className="text-red-400 text-sm font-bold">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading || !form.name || !form.email}
          className="rtt-cta disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </div>
    </div>
  );
}