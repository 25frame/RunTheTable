"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { authedPost, getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HealthTab = {
  name: string;
  exists: boolean;
  rows: number;
  columns: number;
};

type HealthResponse = {
  ok: boolean;
  spreadsheetId?: string;
  formUrl?: string;
  checkedAt?: string;
  tabs?: HealthTab[];
  error?: string;
};

export default function AdminHealthPage() {
  const router = useRouter();

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    runHealthCheck();
  }, [router]);

  async function runHealthCheck() {
    setLoading(true);
    setError("");

    try {
      const result = (await authedPost("adminHealthCheck", {})) as HealthResponse;
      setHealth(result);

      if (result?.ok === false) {
        setError(result.error || "Health check failed.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to run health check.";

      setError(message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  async function runSetup() {
    setBusy("Setup");
    setError("");

    try {
      await authedPost("adminHealthCheck", {});
      await runHealthCheck();
      alert("Health check complete.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Setup failed.";
      setError(message);
      alert(message);
    } finally {
      setBusy("");
    }
  }

  const tabs = health?.tabs || [];
  const missingTabs = tabs.filter((tab) => !tab.exists);
  const existingTabs = tabs.filter((tab) => tab.exists);

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="rtt-mini-kicker">Backend Check</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Health
          </h1>
        </div>

        <button
          type="button"
          onClick={runHealthCheck}
          disabled={loading || Boolean(busy)}
          className="shrink-0 rounded-full bg-rtt-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] disabled:opacity-50 md:px-5 md:text-xs"
        >
          {loading ? "Checking" : "Refresh"}
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice
          title={missingTabs.length ? "Backend Issues Found" : "Backend Ready"}
          tone={missingTabs.length ? "warning" : "success"}
        >
          This page checks that the required Google Sheet tabs are reachable and
          shaped correctly for the RTT admin system.
        </AdminNotice>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Status" value={loading ? "Checking" : health?.ok ? "OK" : "Error"} />
        <Metric label="Tabs OK" value={existingTabs.length} />
        <Metric label="Missing" value={missingTabs.length} />
        <Metric
          label="Checked"
          value={
            health?.checkedAt
              ? new Date(health.checkedAt).toLocaleTimeString()
              : "-"
          }
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <p className="rtt-mini-kicker">System Links</p>

          <div className="mt-5 grid gap-3">
            <InfoRow label="Spreadsheet ID" value={health?.spreadsheetId || "-"} />
            <InfoRow label="Form URL" value={health?.formUrl || "-"} />
            <InfoRow
              label="Last Check"
              value={
                health?.checkedAt
                  ? new Date(health.checkedAt).toLocaleString()
                  : "-"
              }
            />
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={loading || Boolean(busy)}
              className="rtt-cta disabled:opacity-50"
            >
              {loading ? "Checking..." : "Run Health Check"}
            </button>

            <button
              type="button"
              onClick={runSetup}
              disabled={loading || Boolean(busy)}
              className="rtt-secondary disabled:opacity-50"
            >
              {busy === "Setup" ? "Running..." : "Verify Setup"}
            </button>
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">Sheets</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                Required Tabs
              </h2>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
              {tabs.length} checked
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              Checking backend...
            </div>
          ) : tabs.length ? (
            <div className="grid gap-3">
              {tabs.map((tab) => (
                <TabCard key={tab.name} tab={tab} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              No health data returned.
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

function TabCard({ tab }: { tab: HealthTab }) {
  return (
    <article
      className={
        tab.exists
          ? "rounded-2xl border border-white/10 bg-black/40 p-4"
          : "rounded-2xl border border-red-500/30 bg-red-950/30 p-4"
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-black uppercase tracking-[-0.04em]">
            {tab.name}
          </p>

          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            {tab.exists ? "Available" : "Missing"}
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
          {tab.exists ? "OK" : "Fix"}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <SmallStat label="Rows" value={tab.rows} />
        <SmallStat label="Cols" value={tab.columns} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[1.5rem]">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40 md:text-[10px]">
        {label}
      </p>

      <p className="mt-2 truncate text-xl font-black uppercase tracking-[-0.04em] md:text-2xl">
        {value}
      </p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/45 px-3 py-3">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-xl font-black leading-none text-white">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/45 p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-all text-sm font-bold leading-6 text-white/70">
        {value}
      </p>
    </div>
  );
}