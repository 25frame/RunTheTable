"use client";
import { useState } from "react";
import { authedPost } from "@/lib/auth";

export function PhotoUploader({ playerId, currentPhoto }: { playerId: string; currentPhoto?: string }) {
  const [preview, setPreview] = useState(currentPhoto || "");
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return alert("Please choose an image file.");
    if (file.size > 2.5 * 1024 * 1024) return alert("Image is too large. Use an image under 2.5 MB.");
    setBusy(true);
    try {
      const base64 = await fileToBase64(file);
      const data = await authedPost("uploadPlayerPhoto", { playerId, filename: file.name, mimeType: file.type, base64 });
      setPreview(data.photoUrl);
      alert("Photo uploaded.");
    } catch (err) { alert(String(err)); }
    finally { setBusy(false); }
  }

  return <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-rtt-red">Profile Photo</p><div className="mt-4 overflow-hidden rounded-3xl bg-black">{preview ? <img src={preview} alt="Player profile" className="h-72 w-full object-cover"/> : <div className="flex h-72 items-center justify-center text-white/40">No photo yet</div>}</div><label className="mt-5 block cursor-pointer rounded-2xl bg-rtt-red px-6 py-4 text-center text-sm font-black uppercase tracking-[0.2em]">{busy ? "Uploading..." : "Upload Photo"}<input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}/></label><p className="mt-3 text-xs leading-5 text-white/45">Recommended: square JPG/PNG under 2.5 MB.</p></div>;
}
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
