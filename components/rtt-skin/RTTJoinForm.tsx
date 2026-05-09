"use client";

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { uploadRTTPhoto } from "@/lib/rttPhotoUpload";
import { RTTGlassPanel } from "@/components/rtt-skin/RTTGlassPanel";
import { RTTPrimaryButton, RTTSecondaryLink } from "@/components/rtt-skin/RTTButtons";
import { RTTQrBox } from "@/components/rtt-skin/RTTQrBox";

type SkinConfig = Record<string, unknown>;

type RTTJoinFormProps = {
  config?: SkinConfig;
  formUrl?: string;
};

type JoinValues = {
  displayName: string;
  email: string;
  phone: string;
  instagram: string;
  skillLevel: string;
  paymentHandle: string;
  courtCode: string;
  notes: string;
};

function text(config: SkinConfig | undefined, key: string, fallback: string): string {
  const value = config?.[key];
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function normalizeInstagram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function RTTJoinForm({ config = {}, formUrl }: RTTJoinFormProps) {
  const [values, setValues] = useState<JoinValues>({
    displayName: "",
    email: "",
    phone: "",
    instagram: "",
    skillLevel: "Casual",
    paymentHandle: "",
    courtCode: "",
    notes: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  const ctaLabel = text(config, "join.submitButton", text(config, "join.ctaLabel", "CHECK-IN & JOIN"));

  const submitDisabled = useMemo(() => {
    return status === "submitting" || !values.displayName.trim() || !values.email.trim();
  }, [status, values.displayName, values.email]);

  function setField<K extends keyof JoinValues>(key: K, value: JoinValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setPhotoFile(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const displayName = values.displayName.trim();
    const email = values.email.trim();

    if (!displayName || !email) {
      setError("Name and email are required to check in.");
      return;
    }

    setStatus("submitting");

    try {
      let photoUrl = "";

      if (photoFile) {
        photoUrl = await uploadRTTPhoto(photoFile);
      }

      const payload = {
        displayName,
        name: displayName,
        fullName: displayName,
        email,
        phone: values.phone.trim(),
        instagram: normalizeInstagram(values.instagram),
        skillLevel: values.skillLevel,
        paymentHandle: values.paymentHandle.trim(),
        photoUrl,
        courtCode: values.courtCode.trim(),
        notes: values.notes.trim(),
      };

      const response = await fetch("/api/rtt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", payload }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok === false) {
        throw new Error(result?.message || result?.error || "Check-in failed. Try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Check-in failed. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rttb-stack">
        <RTTGlassPanel>
          <span className="rttb-mini-kicker">{text(config, "join.successKicker", "CHECK-IN LOCKED")}</span>
          <h2 className="rttb-panel-title">{text(config, "join.successTitle", "YOU'RE ON THE BOARD")}</h2>
          <p className="rttb-panel-subtitle">
            {text(config, "join.successSubtitle", "You are checked in. Watch live battles or check the standings.")}
          </p>
          <div className="rttb-stack" style={{ marginTop: 16 }}>
            <RTTSecondaryLink href="/live">{text(config, "join.watchLiveButton", "WATCH LIVE")}</RTTSecondaryLink>
            <RTTSecondaryLink href="/standings">{text(config, "join.viewBoardButton", "VIEW THE BOARD")}</RTTSecondaryLink>
          </div>
        </RTTGlassPanel>
      </div>
    );
  }

  return (
    <div className="rttb-stack">
      <RTTGlassPanel>
        <div className="rttb-section-heading">
          <div>
            <span className="rttb-mini-kicker">{text(config, "join.kicker", "PLAYER CHECK-IN")}</span>
            <h2 className="rttb-panel-title">{text(config, "join.cardTitle", "CHECK-IN NOW")}</h2>
            <p className="rttb-panel-subtitle">
              {text(config, "join.cardSubtitle", "Scan the court QR, enter your info, and join the next battle.")}
            </p>
          </div>
        </div>

        <div className="rttb-qr-grid" style={{ marginBottom: 14 }}>
          <RTTQrBox label={text(config, "join.qrLabel", "COURT QR")} />
          <div>
            <span className="rttb-mini-kicker">{text(config, "join.qrKicker", "SCAN-IN READY")}</span>
            <p className="rttb-panel-subtitle" style={{ marginTop: 0 }}>
              {text(config, "join.qrText", "Already scanned? Finish your check-in below.")}
            </p>
          </div>
        </div>

        <form className="rttb-form" onSubmit={onSubmit}>
          <div className="rttb-field">
            <label htmlFor="rtt-display-name">Name</label>
            <input
              id="rtt-display-name"
              className="rttb-input"
              value={values.displayName}
              onChange={(event) => setField("displayName", event.target.value)}
              placeholder="Your player name"
              autoComplete="name"
              required
            />
          </div>

          <div className="rttb-field">
            <label htmlFor="rtt-email">Email</label>
            <input
              id="rtt-email"
              className="rttb-input"
              type="email"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="rttb-two-col">
            <div className="rttb-field">
              <label htmlFor="rtt-phone">Phone</label>
              <input
                id="rtt-phone"
                className="rttb-input"
                value={values.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="Optional"
                autoComplete="tel"
              />
            </div>

            <div className="rttb-field">
              <label htmlFor="rtt-instagram">Instagram</label>
              <input
                id="rtt-instagram"
                className="rttb-input"
                value={values.instagram}
                onChange={(event) => setField("instagram", event.target.value)}
                placeholder="@handle"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="rttb-two-col">
            <div className="rttb-field">
              <label htmlFor="rtt-skill">Skill</label>
              <select
                id="rtt-skill"
                className="rttb-select"
                value={values.skillLevel}
                onChange={(event) => setField("skillLevel", event.target.value)}
              >
                <option>Casual</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Elite</option>
              </select>
            </div>

            <div className="rttb-field">
              <label htmlFor="rtt-court-code">Court Code</label>
              <input
                id="rtt-court-code"
                className="rttb-input"
                value={values.courtCode}
                onChange={(event) => setField("courtCode", event.target.value.toUpperCase())}
                placeholder="RTT-NYC-001"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="rttb-field">
            <label htmlFor="rtt-payment">Payment Handle</label>
            <input
              id="rtt-payment"
              className="rttb-input"
              value={values.paymentHandle}
              onChange={(event) => setField("paymentHandle", event.target.value)}
              placeholder="Cash App / Venmo / Zelle"
              autoComplete="off"
            />
          </div>

          <div className="rttb-field">
            <label htmlFor="rtt-photo">Photo</label>
            <input id="rtt-photo" className="rttb-file-input" type="file" accept="image/*" onChange={onPhotoChange} />
          </div>

          <div className="rttb-field">
            <label htmlFor="rtt-notes">Notes</label>
            <textarea
              id="rtt-notes"
              className="rttb-textarea"
              value={values.notes}
              onChange={(event) => setField("notes", event.target.value)}
              placeholder="Anything the admin should know?"
            />
          </div>

          {error ? <div className="rttb-error">{error}</div> : null}

          <RTTPrimaryButton type="submit" disabled={submitDisabled}>
            {status === "submitting" ? "CHECKING IN..." : ctaLabel}
          </RTTPrimaryButton>
        </form>
      </RTTGlassPanel>

      {formUrl ? (
        <RTTGlassPanel>
          <span className="rttb-mini-kicker">Backup Form</span>
          <p className="rttb-panel-subtitle" style={{ marginTop: 0 }}>
            If the app check-in is unavailable, use the linked Google Form.
          </p>
          <a href={formUrl} target="_blank" rel="noreferrer" className="rttb-secondary-cta" style={{ marginTop: 12 }}>
            OPEN BACKUP FORM
          </a>
        </RTTGlassPanel>
      ) : null}
    </div>
  );
}
