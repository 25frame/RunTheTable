"use client";

import { useState } from "react";
import { supabase, BUCKET } from "@/lib/supabaseClient";
import { authedPost } from "@/lib/auth";

export function PhotoUploader({ playerId, currentPhoto }) {
  const [preview, setPreview] = useState(currentPhoto || "");
  const [loading, setLoading] = useState(false);

  async function upload(file) {
    if (!file.type.startsWith("image/")) {
      alert("Image only");
      return;
    }

    setLoading(true);

    try {
      const fileName = `${Date.now()}-${playerId}`;
      const path = `players/${playerId}/${fileName}`;

      // Upload to Supabase
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file);

      if (error) throw error;

      // Get public URL
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

      const url = data.publicUrl;

      // Save to your system
      await authedPost("updatePlayerProfile", {
        playerId,
        photo: url,
      });

      setPreview(url);
      alert("Uploaded");
    } catch (e) {
      alert(e.message);
    }

    setLoading(false);
  }

  return (
    <div>
      {preview && <img src={preview} style={{ width: "100%" }} />}

      <input
        type="file"
        onChange={(e) => upload(e.target.files[0])}
      />

      {loading && <p>Uploading...</p>}
    </div>
  );
}