"use client";

import { PhotoUploader } from "@/components/PhotoUploader";
import { authedPost, getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTPlayer } from "@/lib/googleData";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayerEditProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [player, setPlayer] = useState<RTTPlayer | null>(null);
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || (user.role !== "admin" && user.playerId !== params.id)) {
      alert("You can only edit your own profile.");
      router.push("/login");
      return;
    }

    getRTTData().then((data) => {
      const found = data.players.find((p) => p.id === params.id) || null;
      setPlayer(found);
      setName(found?.name || "");
      setInstagram(found?.handle || "");
    });
  }, [params.id, router]);

  async function saveProfile() {
    setSaving(true);

    try {
      await authedPost("updatePlayerProfile", {
        playerId: params.id,
        name,
        instagram
      });

      alert("Profile saved.");
    } catch (err) {
      alert(String(err));
    } finally {
      setSaving(false);
    }
  }

  if (!player) {
    return (
      <main className="rtt-shell text-white">
        <section className="rtt-max">Loading profile...</section>
      </main>
    );
  }

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Player Account</p>
        <h1 className="rtt-title">EDIT<br />PROFILE</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <PhotoUploader playerId={player.id} currentPhoto={player.photo} />

          <div className="rtt-card p-5">
            <p className="rtt-kicker">Public Info</p>

            <label className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
              Display Name
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
              Instagram / Handle
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@handle"
            />

            <button
              disabled={saving}
              onClick={saveProfile}
              className="rtt-cta mt-6 w-full disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button
              onClick={() => router.push(`/players/${player.id}`)}
              className="rtt-secondary mt-3 w-full"
            >
              View Public Profile
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
