"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { repairRTTSiteData, syncForm } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData } from "@/lib/googleData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DashboardStats = {
  competitors: number;
  battles: number;
  king: string;
  live: string;
};

const DEFAULT_STATS: DashboardStats = {
  competitors: 0,
  battles: 0,
  king: "Open",
  live: "No",
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const tiles = useMemo(
    () => [
      {
        title: "Live Scoring",
        description: "Score active battles.",
        href: "/admin/matches",
        hot: true,
      },
      {
        title: "Players",
        description: "Review roster.",
        href: "/admin/players",
        hot: false,
      },
      {
        title: "QR Check-In",
        description: "Show player scan screen.",
        href: "/admin/qr",
        hot: true,
      },
      {
        title: "Create Player",
        description: "Add player/login.",
        href: "/admin/create-player",
        hot: false,
      },
      {
        title: "Create Battle",
        description: "Schedule match.",
        href: "/admin/create-match",
        hot: false,
      },
      {
        title: "Users",
        description: "Manage access.",
        href: "/admin/users",
        hot: false,
      },
      {
        title: "Places",
        description: "Manage table spots.",
        href: "/admin/places",
        hot: false,
      },
      {
        title: "Config",
        description: "Edit site wording.",
        href: "/admin/config",
        hot: false,
      },
      {
        title: "Skins",
        description: "Switch site theme.",
        href: "/admin/skins",
        hot: false,
      },
      {
        title: "Setup",
        description: "Event settings.",
        href: "/admin/setup",
        hot: false,
      },
      {
        title: "Health",
        description: "Check backend.",
        href: "/admin/health",
        hot: false,
      },
      {
        title: "Control",
        description: "Sync and recalc.",
        href: "/admin/control",
        hot: false,
      },
      {
        title: "Public Live",
        description: "Open scoreboard.",
        href: "/live",
        hot: false,
      },
      {
        title: "Rules",
        description: "Open rules page.",
        href: "/rules",
        hot: false,
      },
      {
        title: "Public Places",
        description: "Open places page.",
        href: "/places",
        hot: false,
      },
    ],
    []
  );

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/rtt?fresh=1", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Unable to load dashboard. HTTP ${response.status}`);
      }

      const data = (await response.json()) as RTTData;

      if (data.ok === false) {
        throw new Error(data.error || "RTT API returned ok:false.");
      }

      const players = data.players || [];
      const matches = data.matches || [];
      const liveMatch = matches.find(
        (match) => (match.status || "").toLowerCase() === "live"
      );

      setStats({
        competitors: players.length,
        battles: matches.length,
        king: players[0]?.handle || players[0]?.name || "Open",
        live: liveMatch ? "Yes" : "No",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard."
      );
      setStats(DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  }

  async function syncNow() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const formResult = await syncForm();
      const repairResult = await repairRTTSiteData();

      setMessage(
        [
          formResult.message || "Form sync complete.",
          repairResult.message || "System repaired/resynced.",
        ].join(" ")
      );

      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sync now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="rtt-mini-kicker">RTT Admin</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Dashboard
          </h1>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={loadDashboard}
            disabled={busy || loading}
            className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Reload"}
          </button>

          <button
            type="button"
            onClick={syncNow}
            disabled={busy}
            className="rounded-full bg-rtt-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            {busy ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <AdminNotice title="Admin Operations">
          Use QR Check-In for players scanning at the table. Use Players for
          roster cleanup and deletion. Use Places for table locations. Use Config
          for public page wording. Use Skins to switch visual packages.
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

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <DashboardStat label="Competitors" value={stats.competitors} />
        <DashboardStat label="Battles" value={stats.battles} />
        <DashboardStat label="King" value={stats.king} />
        <DashboardStat label="Live" value={stats.live} />
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <DashboardTile
            key={tile.href}
            title={tile.title}
            description={tile.description}
            href={tile.href}
            hot={tile.hot}
          />
        ))}

        <button
          type="button"
          onClick={syncNow}
          disabled={busy}
          className="rounded-[1.8rem] bg-rtt-red p-6 text-left transition hover:scale-[1.01] disabled:opacity-50 md:min-h-36 md:rounded-[2rem] md:p-8"
        >
          <h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white md:text-3xl">
            {busy ? "Syncing..." : "Sync Now"}
          </h2>

          <p className="mt-4 text-sm font-black leading-6 text-white/80 md:text-base">
            Pull forms and recalculate standings.
          </p>
        </button>
      </section>
    </AdminShell>
  );
}

function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem] md:p-6">
      <p className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-white/35 md:text-xs">
        {label}
      </p>

      <p className="mt-3 truncate text-3xl font-black uppercase tracking-[-0.05em] text-white md:text-4xl">
        {value}
      </p>
    </div>
  );
}

function DashboardTile({
  title,
  description,
  href,
  hot,
}: {
  title: string;
  description: string;
  href: string;
  hot: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        hot
          ? "rounded-[1.8rem] bg-rtt-red p-6 transition hover:scale-[1.01] md:min-h-36 md:rounded-[2rem] md:p-8"
          : "rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-6 transition hover:border-rtt-red hover:bg-white/[0.075] md:min-h-36 md:rounded-[2rem] md:p-8"
      }
    >
      <h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white md:text-3xl">
        {title}
      </h2>

      <p
        className={
          hot
            ? "mt-4 text-sm font-black leading-6 text-white/80 md:text-base"
            : "mt-4 text-sm font-black leading-6 text-white/45 md:text-base"
        }
      >
        {description}
      </p>
    </Link>
  );
}
