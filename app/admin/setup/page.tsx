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
  message?: string;
};

export default function AdminSetupPage() {
  const router = useRouter();

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    runHealthCheck(false);
  }, [router]);

  async function runHealthCheck(showAlert = true) {
    setBusy("Health Check");
    setError("");
    setMessage("");

    try {
      const result = (await authedPost(
        "adminHealthCheck",
        {}
      )) as HealthResponse;

      setHealth(result);

      if (result?.ok === false) {
        const nextError = result.error || "Health check failed.";
        setError(nextError);
        if (showAlert) alert(nextError);
        return;
      }

      const nextMessage = "Health check complete.";
      setMessage(nextMessage);
      if (showAlert) alert(nextMessage);
    } catch (err) {
      const nextError =
        err instanceof Error ? err.message : "Unable to run health check.";

      setError(nextError);
      if (showAlert) alert(nextError);
    } finally {
      setBusy("");
    }
  }

  async function runSetup() {
    setBusy("Setup");
    setError("");
    setMessage("");

    try {
      /*
       * Your Apps Script backend has runSetup() as a GET helper, but your
       * authenticated POST route may not expose "runSetup" yet.
       *
       * If this returns "Unknown action", add support for "runSetup" in
       * Apps Script doPost, or use the public /exec?action=setup path.
       */
      const result = (await authedPost("runSetup", {})) as HealthResponse;

      const nextMessage = result?.message || "Setup complete.";
      setMessage(nextMessage);

      await runHealthCheck(false);
      alert(nextMessage);
    } catch (err) {
      const nextError =
        err instanceof Error
          ? err.message
          : "Setup failed. Backend may not expose runSetup as an admin POST action.";

      setError(nextError);
      alert(nextError);
    } finally {
      setBusy("");
    }
  }

  async function syncForm() {
    setBusy("Sync Form");
    setError("");
    setMessage("");

    try {
      const result = (await authedPost("syncForm", {})) as {
        ok?: boolean;
        message?: string;
        addedPlayers?: number;
        updatedPlayers?: number;
        addedRegistrations?: number;
        error?: string;
      };

      if (result?.ok === false) {
        throw new Error(result.error || "Form sync failed.");
      }

      const nextMessage =
        result?.message ||
        `Form sync complete. Added players: ${
          result?.addedPlayers ?? 0
        }, updated players: ${result?.updatedPlayers ?? 0}, registrations: ${
          result?.addedRegistrations ?? 0
        }.`;

      setMessage(nextMessage);
      await runHealthCheck(false);
      alert(nextMessage);
    } catch (err) {
      const nextError = err instanceof Error ? err.message : "Form sync failed.";

      setError(nextError);
      alert(nextError);
    } finally {
      setBusy("");
    }
  }

  async function recalcBoard() {
    setBusy("Recalculate Board");
    setError("");
    setMessage("");

    try {
      const result = (await authedPost("recalcStandings", {})) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (result?.ok === false) {
        throw new Error(result.error || "Recalculation failed.");
      }

      const nextMessage = result?.message || "Standings recalculated.";
      setMessage(nextMessage);
      await runHealthCheck(false);
      alert(nextMessage);
    } catch (err) {
      const nextError =
        err instanceof Error ? err.message : "Recalculation failed.";

      setError(nextError);
      alert(nextError);
    } finally {
      setBusy("");
    }
  }

  async function syncAndRecalc() {
    setBusy("Full Refresh");
    setError("");
    setMessage("");

    try {
      const syncResult = (await authedPost("syncForm", {})) as {
        ok?: boolean;
        error?: string;
      };

      if (syncResult?.ok === false) {
        throw new Error(syncResult.error || "Form sync failed.");
      }

      const recalcResult = (await authedPost("recalcStandings", {})) as {
        ok?: boolean;
        error?: string;
      };

      if (recalcResult?.ok === false) {
        throw new Error(recalcResult.error || "Recalculation failed.");
      }

      const nextMessage = "Full refresh complete.";
      setMessage(nextMessage);
      await runHealthCheck(false);
      alert(nextMessage);
    } catch (err) {
      const nextError =
        err instanceof Error ? err.message : "Full refresh failed.";

      setError(nextError);
      alert(nextError);
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
          <p className="rtt-mini-kicker">System Setup</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Setup
          </h1>
        </div>

        <button
          type="button"
          onClick={() => runHealthCheck(true)}
          disabled={Boolean(busy)}
          className="shrink-0 rounded-full bg-rtt-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] disabled:opacity-50 md:px-5 md:text-xs"
        >
          {busy === "Health Check" ? "Checking" : "Check"}
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice
          title={missingTabs.length ? "Setup Needs Attention" : "Setup Console"}
          tone={missingTabs.length ? "warning" : "info"}
        >
          Use this page for controlled backend setup, form synchronization,
          standings recalculation, and sheet health verification. Google Sheets
          should remain the background database, not the operating interface.
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

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Status" value={health?.ok ? "OK" : busy ? "Busy" : "Check"} />
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
          <p className="rtt-mini-kicker">Operator Actions</p>

          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
            Controlled Runs
          </h2>

          <div className="mt-5 grid gap-3">
            <SetupButton
              title="Full Refresh"
              text="Sync forms, recalculate standings, and recheck backend."
              busy={busy}
              busyLabel="Full Refresh"
              primary
              onClick={syncAndRecalc}
            />

            <SetupButton
              title="Sync Form"
              text="Pull Google Form registrations into Players and Registrations."
              busy={busy}
              busyLabel="Sync Form"
              onClick={syncForm}
            />

            <SetupButton
              title="Recalculate Board"
              text="Rebuild rankings, points, records, and payout assignments."
              busy={busy}
              busyLabel="Recalculate Board"
              onClick={recalcBoard}
            />

            <SetupButton
              title="Health Check"
              text="Verify required tabs, row counts, and backend availability."
              busy={busy}
              busyLabel="Health Check"
              onClick={() => runHealthCheck(true)}
            />

            <SetupButton
              title="Run Setup"
              text="Initialize required backend sheets if the Apps Script exposes this admin action."
              busy={busy}
              busyLabel="Setup"
              danger={false}
              onClick={runSetup}
            />
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">Backend</p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                Sheet Status
              </h2>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
              {tabs.length} tabs
            </p>
          </div>

          {tabs.length ? (
            <div className="grid gap-3">
              {tabs.map((tab) => (
                <TabCard key={tab.name} tab={tab} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              No setup data loaded yet. Run Health Check.
            </div>
          )}

          <div className="mt-5 grid gap-3">
            <InfoRow label="Spreadsheet ID" value={health?.spreadsheetId || "-"} />
            <InfoRow label="Form URL" value={health?.formUrl || "-"} />
          </div>
        </section>
      </section>
    </AdminShell>
  );
}

function SetupButton({
  title,
  text,
  busy,
  busyLabel,
  onClick,
  primary = false,
  danger = false,
}: {
  title: string;
  text: string;
  busy: string;
  busyLabel: string;
  onClick: () => void | Promise<void>;
  primary?: boolean;
  danger?: boolean;
}) {
  const disabled = Boolean(busy);
  const active = busy === busyLabel;

  const cls = primary
    ? "bg-rtt-red text-white"
    : danger
      ? "border border-red-500/30 bg-red-950/30 text-red-100"
      : "border border-white/10 bg-black/45 text-white";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.5rem] p-5 text-left transition active:scale-[0.985] disabled:opacity-50 ${cls}`}
    >
      <span className="block text-xl font-black uppercase tracking-[-0.04em]">
        {active ? "Working..." : title}
      </span>

      <span className="mt-2 block text-sm font-bold leading-6 text-white/55">
        {text}
      </span>
    </button>
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