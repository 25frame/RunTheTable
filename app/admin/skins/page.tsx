"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { updateSiteConfig } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData } from "@/lib/googleData";
import { RTT_SKINS, normalizeSkinId, type RTTSkinId } from "@/lib/skins";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSkinsPage() {
  const router = useRouter();

  const [activeSkin, setActiveSkin] = useState<RTTSkinId>("default");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadSkin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadSkin() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/rtt?fresh=1", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Unable to load skin. HTTP ${response.status}`);
      }

      const data = (await response.json()) as RTTData;

      if (data.ok === false) {
        throw new Error(data.error || "RTT API returned ok:false.");
      }

      const skin = normalizeSkinId(data.config?.["theme.activeSkin"]);
      setActiveSkin(skin);
      document.documentElement.dataset.rttSkin = skin;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load skin.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSkin(skinId: RTTSkinId) {
    setBusy(true);
    setError("");
    setMessage(`Applying ${skinId} skin...`);

    try {
      const result = await updateSiteConfig({
        updates: {
          "theme.activeSkin": skinId,
        },
      });

      if (!result.ok) {
        throw new Error(result.error || "Unable to save skin.");
      }

      setActiveSkin(skinId);
      document.documentElement.dataset.rttSkin = skinId;
      setMessage(result.message || "Skin updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save skin.");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="rtt-mini-kicker">Theme</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Skins
          </h1>
        </div>

        <button
          type="button"
          onClick={loadSkin}
          disabled={busy || loading}
          className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Reload"}
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice title="Skin Packages">
          Choose the active visual skin for the public site and admin UI. The
          default skin remains the production baseline. Street Red is the new
          black/red package.
        </AdminNotice>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-[1.5rem] border border-green-500/30 bg-green-950/30 p-4 text-sm text-green-200">
          {message}
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {RTT_SKINS.map((skin) => {
          const active = activeSkin === skin.id;

          return (
            <article
              key={skin.id}
              className={
                active
                  ? "rounded-[2rem] border border-rtt-red bg-rtt-red/15 p-5 shadow-[0_0_30px_rgba(239,0,0,0.18)] md:p-6"
                  : "rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 md:p-6"
              }
            >
              <div
                className={
                  skin.id === "street-red"
                    ? "mb-5 h-32 rounded-[1.5rem] border border-rtt-red/40 bg-[linear-gradient(135deg,#050000_0%,#130000_45%,#ef0000_100%)]"
                    : "mb-5 h-32 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,#000000_0%,#111111_60%,#ef0000_100%)]"
                }
              />

              <p className="rtt-mini-kicker">
                {active ? "Active Skin" : skin.vibe}
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em]">
                {skin.label}
              </h2>

              <p className="mt-3 text-sm font-bold leading-6 text-white/55">
                {skin.description}
              </p>

              <button
                type="button"
                onClick={() => saveSkin(skin.id)}
                disabled={busy || active}
                className={
                  active
                    ? "mt-5 w-full rounded-full border border-white/10 bg-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/40"
                    : "rtt-cta mt-5 w-full disabled:opacity-50"
                }
              >
                {active ? "Current" : busy ? "Applying..." : "Use Skin"}
              </button>
            </article>
          );
        })}
      </section>
    </AdminShell>
  );
}
