"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase, SUPABASE_PHOTO_BUCKET } from "@/lib/supabaseClient";
import { cfg } from "@/lib/siteConfig";
import type { RTTConfig, RTTData } from "@/lib/googleData";

type JoinPayload = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  skill: string;
  notes: string;
  photo: string;
};

type JoinResponse = {
  ok: boolean;
  playerId?: string;
  message?: string;
  error?: string;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-rtt-red";

export default function JoinPage() {
  const [config, setConfig] = useState<RTTConfig>({});
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    setLoadingConfig(true);

    try {
      const response = await fetch("/api/rtt", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as RTTData;
      setConfig(data.config || {});
    } catch {
      setConfig({});
    } finally {
      setLoadingConfig(false);
    }
  }

  async function uploadPhoto(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const safeName =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `${Date.now()}-${crypto.randomUUID()}.${ext}`
        : `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const path = `joins/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_PHOTO_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(SUPABASE_PHOTO_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim().toLowerCase();

      if (!name) {
        throw new Error("Name is required.");
      }

      if (!email) {
        throw new Error("Email is required.");
      }

      let photoUrl = "";
      const file = form.get("photo") as File | null;

      if (file && file.size > 0) {
        photoUrl = await uploadPhoto(file);
      }

      const payload: JoinPayload = {
        name,
        email,
        phone: String(form.get("phone") || "").trim(),
        instagram: String(form.get("instagram") || "").trim(),
        skill: String(form.get("skill") || "Beginner").trim(),
        notes: String(form.get("notes") || "").trim(),
        photo: photoUrl,
      };

      const response = await fetch("/api/rtt", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        cache: "no-store",
        body: JSON.stringify({
          action: "join",
          payload,
        }),
      });

      const text = await response.text();

      if (!text || !text.trim()) {
        throw new Error(
          `Empty response from /api/rtt. HTTP status: ${response.status}`
        );
      }

      let data: JoinResponse;

      try {
        data = JSON.parse(text) as JoinResponse;
      } catch {
        throw new Error(
          `Non-JSON response from /api/rtt: ${text.slice(0, 300)}`
        );
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `Join failed with HTTP ${response.status}`);
      }

      setPlayerId(data.playerId || "");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Join failed.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="rtt-page">
        <section className="rtt-page-inner">
          <section className="rtt-hero">
            <p className="rtt-hero-kicker">
              {cfg(config, "join.successKicker", "You’re In")}
            </p>

            <h1 className="rtt-hero-title">
              {splitTitle(
                cfg(config, "join.successHeroTitle", "Welcome To RTT")
              ).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="rtt-hero-subtitle">
              {cfg(
                config,
                "join.successHeroSubtitle",
                "You are on the board. Admin can now assign you to a battle."
              )}
            </p>
          </section>

          <section className="rtt-mobile-card rtt-mobile-card-hot">
            <p className="rtt-mini-kicker">Player Added</p>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em]">
              {cfg(config, "join.successTitle", "Added to the board.")}
            </h2>

            <p className="mt-3 text-sm font-bold leading-6 text-white/55">
              {cfg(
                config,
                "join.successSubtitle",
                "Admin can now assign you to a battle."
              )}
            </p>

            {playerId ? (
              <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-white/50">
                Player ID / {playerId}
              </p>
            ) : null}
          </section>

          <section className="mt-5 grid gap-3">
            <Link href="/live" className="rtt-cta">
              {cfg(config, "join.watchLiveButton", "Watch Live")}
            </Link>

            <Link href="/standings" className="rtt-secondary">
              {cfg(config, "join.viewBoardButton", "View Board")}
            </Link>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <section className="rtt-hero">
          <p className="rtt-hero-kicker">
            {cfg(config, "join.kicker", "Join")}
          </p>

          <h1 className="rtt-hero-title">
            {splitTitle(cfg(config, "join.title", "Get On The Board")).map(
              (line) => (
                <span key={line} className="block">
                  {line}
                </span>
              )
            )}
          </h1>

          <p className="rtt-hero-subtitle">
            {cfg(
              config,
              "join.subtitle",
              "Enter your info, upload a player photo, and get ranked."
            )}
          </p>
        </section>

        <form onSubmit={submit} className="grid gap-4">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Name
            </span>
            <input
              name="name"
              required
              placeholder="Name"
              autoComplete="name"
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-rtt-red"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Email
            </span>
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-rtt-red"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                Phone
              </span>
              <input
                name="phone"
                placeholder="Phone"
                autoComplete="tel"
                className={`mt-2 ${inputClass}`}
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                Instagram
              </span>
              <input
                name="instagram"
                placeholder="@handle"
                className={`mt-2 ${inputClass}`}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Skill
            </span>

            <select name="skill" className={`mt-2 ${inputClass}`}>
              <option value="Beginner">Beginner</option>
              <option value="Rookie">Rookie</option>
              <option value="Challenger">Challenger</option>
              <option value="Contender">Contender</option>
              <option value="Killer">Killer</option>
            </select>
          </label>

          <label className="rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-white/60">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Player Photo
            </span>

            <input
              type="file"
              name="photo"
              accept="image/*"
              className="mt-3 block w-full text-sm text-white/70"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Notes
            </span>

            <textarea
              name="notes"
              placeholder="Notes"
              className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-rtt-red"
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || loadingConfig}
            className="rtt-cta disabled:opacity-50"
          >
            {loading
              ? "Joining..."
              : cfg(config, "join.submitButton", "Join RTT")}
          </button>
        </form>
      </section>
    </main>
  );
}

function splitTitle(title: string): string[] {
  const cleanTitle = title.trim();

  if (!cleanTitle) return [""];

  if (cleanTitle.toLowerCase() === "get on the board") {
    return ["Get On", "The Board"];
  }

  if (cleanTitle.toLowerCase() === "welcome to rtt") {
    return ["Welcome", "To RTT"];
  }

  const words = cleanTitle.split(/\s+/);

  if (words.length <= 2) return [cleanTitle];

  const midpoint = Math.ceil(words.length / 2);

  return [
    words.slice(0, midpoint).join(" "),
    words.slice(midpoint).join(" "),
  ];
}