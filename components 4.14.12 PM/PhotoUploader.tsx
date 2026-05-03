"use client";

import { useState } from "react";
import { authedPost } from "@/lib/auth";
import { supabase, SUPABASE_PHOTO_BUCKET } from "@/lib/supabaseClient";

type PhotoUploaderProps = {
  playerId: string;
  currentPhoto?: string;
};

export function PhotoUploader({ playerId, currentPhoto = "" }: PhotoUploaderProps) {
  const [preview, setPreview] = useState(currentPhoto);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Use an image under 5 MB.");
      return;
    }

    setBusy(true);

    try {
      const ext = getExtension(file.name);
      const path = `players/${playerId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from(SUPABASE_PHOTO_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from(SUPABASE_PHOTO_BUCKET)
        .getPublicUrl(path);

      const photoUrl = data.publicUrl;

      await authedPost("updatePlayerProfile", {
        playerId,
        photo: photoUrl
      });

      setPreview(photoUrl);
      alert("Photo uploaded.");
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rtt-card p-5">
      <p className="rtt-kicker">Profile Photo</p>

      <div className="mt-4 overflow-hidden rounded-3xl bg-black">
        {preview ? (
          <img src={preview} alt="Player profile" className="h-72 w-full object-cover" />
        ) : (
          <div className="flex h-72 items-center justify-center text-white/40">
            No photo yet
          </div>
        )}
      </div>

      <label className="mt-5 block cursor-pointer rounded-2xl bg-rtt-red px-6 py-4 text-center text-sm font-black uppercase tracking-[0.2em]">
        {busy ? "Uploading..." : "Upload Photo"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      <p className="mt-3 text-xs leading-5 text-white/45">
        Recommended: square JPG/PNG/WebP under 5 MB.
      </p>
    </div>
  );
}

function getExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return ext;
  return "jpg";
}
