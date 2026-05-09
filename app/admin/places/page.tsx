"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createPlace,
  deletePlace,
  updatePlace,
  type CreatePlacePayload,
} from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData, RTTPlace } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-rtt-red";

const textareaClass =
  "min-h-24 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold leading-6 text-white outline-none placeholder:text-white/25 focus:border-rtt-red";

const emptyForm: CreatePlacePayload = {
  name: "",
  borough: "",
  neighborhood: "",
  location: "",
  indoorOutdoor: "Outdoor",
  tableCount: 0,
  equipmentAvailable: "",
  cost: "Free",
  hoursNotes: "",
  sourceUrl: "",
  status: "Active",
  featured: false,
};

export default function AdminPlacesPage() {
  const router = useRouter();

  const [places, setPlaces] = useState<RTTPlace[]>([]);
  const [form, setForm] = useState<CreatePlacePayload>(emptyForm);
  const [editingPlaceId, setEditingPlaceId] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredPlaces = useMemo(() => {
    if (selectedFilter === "featured") {
      return places.filter((place) => place.featured);
    }

    if (selectedFilter === "active") {
      return places.filter(
        (place) => place.status.toLowerCase() === "active"
      );
    }

    if (selectedFilter === "needs-check") {
      return places.filter(
        (place) => place.status.toLowerCase() === "needs check"
      );
    }

    if (selectedFilter === "indoor") {
      return places.filter((place) =>
        place.indoorOutdoor.toLowerCase().includes("indoor")
      );
    }

    if (selectedFilter === "outdoor") {
      return places.filter((place) =>
        place.indoorOutdoor.toLowerCase().includes("outdoor")
      );
    }

    return places;
  }, [places, selectedFilter]);

  const activeEditPlace = useMemo(() => {
    if (!editingPlaceId) return null;
    return places.find((place) => place.id === editingPlaceId) || null;
  }, [editingPlaceId, places]);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadPlaces();
  }, [router]);

  async function loadPlaces() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/rtt", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Unable to load places. HTTP ${response.status}`);
      }

      const data = (await response.json()) as RTTData;

      if (data.ok === false) {
        throw new Error(data.error || "RTT API returned ok:false.");
      }

      setPlaces(data.places || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load places.");
    } finally {
      setLoading(false);
    }
  }

  function updateForm<K extends keyof CreatePlacePayload>(
    key: K,
    value: CreatePlacePayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingPlaceId("");
    setError("");
    setMessage("");
  }

  function startEdit(place: RTTPlace) {
    setEditingPlaceId(place.id);

    setForm({
      name: place.name,
      borough: place.borough,
      neighborhood: place.neighborhood,
      location: place.location,
      indoorOutdoor: place.indoorOutdoor || "Unknown",
      tableCount: place.tableCount || 0,
      equipmentAvailable: place.equipmentAvailable,
      cost: place.cost || "Free",
      hoursNotes: place.hoursNotes,
      sourceUrl: place.sourceUrl,
      status: place.status || "Active",
      featured: place.featured,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function submitPlace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    const cleanName = String(form.name || "").trim();

    if (!cleanName) {
      setError("Place name is required.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (editingPlaceId) {
        const result = await updatePlace({
          placeId: editingPlaceId,
          name: cleanName,
          borough: String(form.borough || "").trim(),
          neighborhood: String(form.neighborhood || "").trim(),
          location: String(form.location || "").trim(),
          indoorOutdoor: String(form.indoorOutdoor || "Unknown").trim(),
          tableCount: Number(form.tableCount) || 0,
          equipmentAvailable: String(form.equipmentAvailable || "").trim(),
          cost: String(form.cost || "").trim(),
          hoursNotes: String(form.hoursNotes || "").trim(),
          sourceUrl: String(form.sourceUrl || "").trim(),
          status: String(form.status || "Active").trim(),
          featured: Boolean(form.featured),
        });

        setMessage(result.message || "Place updated.");
      } else {
        const result = await createPlace({
          name: cleanName,
          borough: String(form.borough || "").trim(),
          neighborhood: String(form.neighborhood || "").trim(),
          location: String(form.location || "").trim(),
          indoorOutdoor: String(form.indoorOutdoor || "Unknown").trim(),
          tableCount: Number(form.tableCount) || 0,
          equipmentAvailable: String(form.equipmentAvailable || "").trim(),
          cost: String(form.cost || "").trim(),
          hoursNotes: String(form.hoursNotes || "").trim(),
          sourceUrl: String(form.sourceUrl || "").trim(),
          status: String(form.status || "Active").trim(),
          featured: Boolean(form.featured),
        });

        setMessage(result.message || "Place created.");
      }

      resetForm();
      await loadPlaces();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save place.");
    } finally {
      setBusy(false);
    }
  }

  async function softDeletePlace(place: RTTPlace) {
    const confirmed = window.confirm(
      `Remove "${place.name}" from the public places list? This will soft-delete it by setting status to Deleted.`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await deletePlace({ placeId: place.id });
      setMessage(result.message || "Place deleted.");
      await loadPlaces();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete place.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleFeatured(place: RTTPlace) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await updatePlace({
        placeId: place.id,
        featured: !place.featured,
      });

      setMessage(result.message || "Featured status updated.");
      await loadPlaces();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update featured status."
      );
    } finally {
      setBusy(false);
    }
  }

  async function setNeedsCheck(place: RTTPlace) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await updatePlace({
        placeId: place.id,
        status: "Needs Check",
      });

      setMessage(result.message || "Place marked Needs Check.");
      await loadPlaces();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="rtt-mini-kicker">Where To Play</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Places
          </h1>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={loadPlaces}
            disabled={busy || loading}
            className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Reload"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/places")}
            className="rounded-full bg-rtt-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white"
          >
            Public View
          </button>
        </div>
      </div>

      <div className="mt-5">
        <AdminNotice title="Places Directory">
          Add and manage places where people can play table tennis. Public
          visitors see active places on the Where To Play page. Use Needs Check
          when a location should be verified before being promoted.
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

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <form
          onSubmit={submitPlace}
          className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">
                {editingPlaceId ? "Edit Place" : "Add Place"}
              </p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                {editingPlaceId ? activeEditPlace?.name || "Editing" : "New Spot"}
              </h2>
            </div>

            {editingPlaceId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/10 bg-black/50 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/60"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="grid gap-4">
            <Field label="Place Name" required>
              <input
                value={form.name || ""}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Brooklyn Bridge Park — Pier 2"
                className={inputClass}
                required
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Borough">
                <select
                  value={form.borough || ""}
                  onChange={(event) =>
                    updateForm("borough", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="Manhattan">Manhattan</option>
                  <option value="Brooklyn">Brooklyn</option>
                  <option value="Queens">Queens</option>
                  <option value="Bronx">Bronx</option>
                  <option value="Staten Island">Staten Island</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Indoor / Outdoor">
                <select
                  value={form.indoorOutdoor || "Unknown"}
                  onChange={(event) =>
                    updateForm("indoorOutdoor", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="Outdoor">Outdoor</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Both">Both</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </Field>
            </div>

            <Field label="Neighborhood">
              <input
                value={form.neighborhood || ""}
                onChange={(event) =>
                  updateForm("neighborhood", event.target.value)
                }
                placeholder="DUMBO / Brooklyn Heights"
                className={inputClass}
              />
            </Field>

            <Field label="Address / Location">
              <input
                value={form.location || ""}
                onChange={(event) => updateForm("location", event.target.value)}
                placeholder="Pier 2, Brooklyn Bridge Park"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Table Count">
                <input
                  type="number"
                  min="0"
                  value={form.tableCount ?? 0}
                  onChange={(event) =>
                    updateForm("tableCount", Number(event.target.value) || 0)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Cost">
                <input
                  value={form.cost || ""}
                  onChange={(event) => updateForm("cost", event.target.value)}
                  placeholder="Free"
                  className={inputClass}
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status || "Active"}
                  onChange={(event) => updateForm("status", event.target.value)}
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Needs Check">Needs Check</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>

            <Field label="Equipment Available">
              <input
                value={form.equipmentAvailable || ""}
                onChange={(event) =>
                  updateForm("equipmentAvailable", event.target.value)
                }
                placeholder="Bring your own paddles and balls"
                className={inputClass}
              />
            </Field>

            <Field label="Hours / Notes">
              <textarea
                value={form.hoursNotes || ""}
                onChange={(event) =>
                  updateForm("hoursNotes", event.target.value)
                }
                placeholder="Verify current hours before going."
                className={textareaClass}
              />
            </Field>

            <Field label="Source URL">
              <input
                value={form.sourceUrl || ""}
                onChange={(event) =>
                  updateForm("sourceUrl", event.target.value)
                }
                placeholder="https://..."
                className={inputClass}
              />
            </Field>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 p-4">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(event) =>
                  updateForm("featured", event.target.checked)
                }
                className="h-5 w-5 accent-red-600"
              />

              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/65">
                Feature this place on top
              </span>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="rtt-cta disabled:opacity-50"
            >
              {busy
                ? "Saving..."
                : editingPlaceId
                  ? "Save Place"
                  : "Create Place"}
            </button>
          </div>
        </form>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="rtt-mini-kicker">Directory</p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                {places.length} Places
              </h2>
            </div>

            <select
              value={selectedFilter}
              onChange={(event) => setSelectedFilter(event.target.value)}
              className="rounded-full border border-white/10 bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white outline-none"
            >
              <option value="all">All</option>
              <option value="featured">Featured</option>
              <option value="active">Active</option>
              <option value="needs-check">Needs Check</option>
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
            </select>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              Loading places...
            </div>
          ) : filteredPlaces.length ? (
            <div className="grid gap-3">
              {filteredPlaces.map((place) => (
                <PlaceAdminCard
                  key={place.id}
                  place={place}
                  disabled={busy}
                  onEdit={() => startEdit(place)}
                  onDelete={() => softDeletePlace(place)}
                  onToggleFeatured={() => toggleFeatured(place)}
                  onNeedsCheck={() => setNeedsCheck(place)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              No places match this filter.
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
        {label}
        {required ? <span className="text-rtt-red"> *</span> : null}
      </span>

      {children}
    </label>
  );
}

function PlaceAdminCard({
  place,
  disabled,
  onEdit,
  onDelete,
  onToggleFeatured,
  onNeedsCheck,
}: {
  place: RTTPlace;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onNeedsCheck: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/45 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red">
            {place.id} / {place.status || "Active"}
          </p>

          <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.04em]">
            {place.name}
          </h3>

          <p className="mt-2 text-xs font-bold leading-5 text-white/45">
            {[place.neighborhood, place.borough, place.indoorOutdoor]
              .filter(Boolean)
              .join(" / ")}
          </p>
        </div>

        {place.featured ? (
          <span className="shrink-0 rounded-full bg-rtt-red px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white">
            Featured
          </span>
        ) : null}
      </div>

      {place.location ? (
        <p className="mt-3 text-sm font-bold leading-6 text-white/55">
          {place.location}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Mini label="Tables" value={place.tableCount || "?"} />
        <Mini label="Cost" value={place.cost || "Check"} />
        <Mini label="Type" value={place.indoorOutdoor || "Unknown"} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
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
          onClick={onToggleFeatured}
          disabled={disabled}
          className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/65 disabled:opacity-50"
        >
          {place.featured ? "Unfeature" : "Feature"}
        </button>

        <button
          type="button"
          onClick={onNeedsCheck}
          disabled={disabled}
          className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/65 disabled:opacity-50"
        >
          Needs Check
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