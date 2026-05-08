"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  deletePlayer,
  repairRTTSiteData,
  updatePlayerAdmin,
} from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-rtt-red";

type EditablePlayer = {
  playerId: string;
  displayName: string;
  skill: string;
  instagram: string;
  status: string;
};

export default function AdminPlayersPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  const [editing, setEditing] = useState<EditablePlayer | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredPlayers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return players;

    return players.filter((player) => {
      return (
        player.id.toLowerCase().includes(term) ||
        player.name.toLowerCase().includes(term) ||
        player.handle.toLowerCase().includes(term) ||
        player.skill.toLowerCase().includes(term)
      );
    });
  }, [players, search]);

  const topPlayer = players[0];

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadPlayers() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/rtt?fresh=1", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Unable to load players. HTTP ${response.status}`);
      }

      const data = (await response.json()) as RTTData;

      if (data.ok === false) {
        throw new Error(data.error || "RTT API returned ok:false.");
      }

      setPlayers(data.players || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load players.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(player: RTTPlayer) {
    setEditing({
      playerId: player.id,
      displayName: player.name,
      skill: player.skill || "Unranked",
      instagram: player.handle || "",
      status: "Active",
    });

    setError("");
    setMessage("");
  }

  function cancelEdit() {
    setEditing(null);
    setError("");
    setMessage("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) return;

    const name = editing.displayName.trim();

    if (!name) {
      setError("Display name is required.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await updatePlayerAdmin({
        playerId: editing.playerId,
        displayName: name,
        skill: editing.skill.trim(),
        instagram: editing.instagram.trim(),
        status: editing.status.trim() || "Active",
      });

      setMessage(result.message || "Player updated.");
      setEditing(null);
      await loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update player.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelectedPlayer(player: RTTPlayer) {
    const confirmed = window.confirm(
      [
        `Delete player "${player.handle || player.name}"?`,
        "",
        "This will hide the player from public active lists.",
        "If they have verified final matches, match history will be retained.",
        "If they never played, open matches and registrations will be removed/cancelled.",
        "",
        "Continue?",
      ].join("\n")
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await deletePlayer({ playerId: player.id });

      const historyNote =
        result.hadVerifiedHistory === true
          ? "Historical final matches retained."
          : "No verified match history retained.";

      const cancelledNote =
        typeof result.cancelledOpenMatches === "number"
          ? ` Cancelled open matches: ${result.cancelledOpenMatches}.`
          : "";

      setMessage(
        `${result.message || "Player deleted and resynced."} ${historyNote}${cancelledNote}`
      );

      if (editing?.playerId === player.id) {
        setEditing(null);
      }

      await loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete player.");
    } finally {
      setBusy(false);
    }
  }

  async function resyncSystem() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await repairRTTSiteData();
      setMessage(result.message || "System resynced.");
      setEditing(null);
      await loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resync system.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="rtt-mini-kicker">Roster</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Players
          </h1>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={loadPlayers}
            disabled={busy || loading}
            className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Reload"}
          </button>

          <button
            type="button"
            onClick={resyncSystem}
            disabled={busy}
            className="rounded-full bg-rtt-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            Resync
          </button>
        </div>
      </div>

      <div className="mt-5">
        <AdminNotice title="Player Management">
          Use this page to edit players, delete players, and resync the public
          board. Deleting a player is a soft delete. Verified final match
          history is retained; open/unverified matches are cancelled.
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

      <section className="mt-6 grid grid-cols-3 gap-2">
        <MiniStat label="Active Players" value={players.length} />
        <MiniStat label="Top Player" value={topPlayer?.handle || topPlayer?.name || "Open"} />
        <MiniStat label="Top Pts" value={topPlayer?.points ?? 0} />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
          <p className="rtt-mini-kicker">
            {editing ? "Edit Player" : "Search"}
          </p>

          {editing ? (
            <form onSubmit={saveEdit} className="mt-4 grid gap-4">
              <Field label="Player ID">
                <input
                  value={editing.playerId}
                  readOnly
                  className={`${inputClass} opacity-60`}
                />
              </Field>

              <Field label="Display Name">
                <input
                  value={editing.displayName}
                  onChange={(event) =>
                    setEditing((current) =>
                      current
                        ? { ...current, displayName: event.target.value }
                        : current
                    )
                  }
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Skill">
                <select
                  value={editing.skill}
                  onChange={(event) =>
                    setEditing((current) =>
                      current
                        ? { ...current, skill: event.target.value }
                        : current
                    )
                  }
                  className={inputClass}
                >
                  <option value="Unranked">Unranked</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Rookie">Rookie</option>
                  <option value="Challenger">Challenger</option>
                  <option value="Contender">Contender</option>
                  <option value="Killer">Killer</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>

              <Field label="Instagram">
                <input
                  value={editing.instagram}
                  onChange={(event) =>
                    setEditing((current) =>
                      current
                        ? { ...current, instagram: event.target.value }
                        : current
                    )
                  }
                  placeholder="@handle"
                  className={inputClass}
                />
              </Field>

              <Field label="Status">
                <select
                  value={editing.status}
                  onChange={(event) =>
                    setEditing((current) =>
                      current
                        ? { ...current, status: event.target.value }
                        : current
                    )
                  }
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Deleted">Deleted</option>
                </select>
              </Field>

              <button
                type="submit"
                disabled={busy}
                className="rtt-cta disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Player"}
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                disabled={busy}
                className="rtt-secondary disabled:opacity-50"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="mt-4 grid gap-4">
              <Field label="Search Players">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, handle, ID, skill..."
                  className={inputClass}
                />
              </Field>

              <div className="rounded-2xl bg-black/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Active Public Players
                </p>

                <p className="mt-1 text-4xl font-black leading-none text-rtt-red">
                  {players.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Delete Logic
                </p>

                <p className="mt-2 text-sm font-bold leading-6 text-white/50">
                  Players with final verified matches are hidden, but match
                  history stays. Players with no verified matches disappear
                  cleanly after registrations/open matches are removed or
                  cancelled.
                </p>
              </div>
            </div>
          )}
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">Directory</p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                {filteredPlayers.length} Players
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              Loading players...
            </div>
          ) : filteredPlayers.length ? (
            <div className="grid gap-3">
              {filteredPlayers.map((player) => (
                <PlayerAdminCard
                  key={player.id}
                  player={player}
                  disabled={busy}
                  onEdit={() => startEdit(player)}
                  onDelete={() => deleteSelectedPlayer(player)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              No players match this search.
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
        {label}
      </span>

      {children}
    </label>
  );
}

function PlayerAdminCard({
  player,
  disabled,
  onEdit,
  onDelete,
}: {
  player: RTTPlayer;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hasPlayed = player.wins + player.losses > 0;

  return (
    <article className="rounded-2xl border border-white/10 bg-black/45 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red">
            {player.id} / Rank #{player.rank}
          </p>

          <h3 className="mt-2 truncate text-xl font-black uppercase tracking-[-0.04em]">
            {player.handle || player.name}
          </h3>

          <p className="mt-2 truncate text-xs font-bold leading-5 text-white/45">
            {player.skill || "Unranked"}
          </p>

          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
            {hasPlayed ? "Has match history" : "No verified match history"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-3xl font-black text-rtt-red">{player.points}</p>
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
            pts
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Mini label="Wins" value={player.wins} />
        <Mini label="Losses" value={player.losses} />
        <Mini label="Diff" value={player.pointDiff} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="rounded-full bg-rtt-red px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-white disabled:opacity-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-red-200 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="truncate text-lg font-black uppercase tracking-[-0.04em] text-white">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  );
}

function Mini({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-black/50 px-3 py-3">
      <p className="truncate text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black uppercase text-white">
        {value}
      </p>
    </div>
  );
}