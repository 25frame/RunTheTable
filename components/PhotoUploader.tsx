"use client";

import { useState } from "react";
import { supabase, BUCKET } from "@/lib/supabaseClient";
import { authedPost } from "@/lib/auth";

type PhotoUploaderProps = {
  playerId: string;
  currentPhoto?: string;
};

export function PhotoUploader({ playerId, currentPhoto = "" }: PhotoUploaderProps) {
  const [preview, setPreview] = useState(currentPhoto);
  const [loading, setLoading] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Image only");
      return;
    }

    setLoading(true);

    try {
      const fileName = `${Date.now()}-${playerId}`;
      const path = `players/${playerId}/${fileName}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, file);

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const url = data.publicUrl;

      await authedPost("updatePlayerProfile", {
        playerId,
        photo: url,
      });

      setPreview(url);
      alert("Uploaded");
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {preview && <img src={preview} style={{ width: "100%" }} alt="Player profile" />}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => upload(e.target.files?.[0])}
      />

      {loading && <p>Uploading...</p>}
    </div>
  );
}