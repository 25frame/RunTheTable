"use client";
import { PhotoUploader } from "@/components/PhotoUploader";
import { authedPost, getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTPlayer } from "@/lib/googleData";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayerEditProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<RTTPlayer | null>(null);
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || (user.role !== "admin" && user.playerId !== params.id)) {
      alert("You can only edit your own profile.");
      router.push("/login");
      return;
    }
    getRTTData().then((data) => {
      const found = data.players.find((p) => p.id === params.id) || null;
      setPlayer(found);
      setName(found?.name || "");
      setInstagram(found?.handle || "");
    });
  }, [params.id, router]);

  async function saveProfile() {
    setSaving(true);
    try { await authedPost("updatePlayerProfile", { playerId: params.id, name, instagram }); alert("Profile saved."); }
    catch (err) { alert(String(err)); }
    finally { setSaving(false); }
  }

  if (!player) return <main className="mx-auto min-h-screen max-w-4xl px-5 py-10 text-white">Loading profile...</main>;
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 text-white"><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Player Account</p><h1 className="mt-3 text-5xl font-black italic uppercase">Edit Profile</h1><div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]"><PhotoUploader playerId={player.id} currentPhoto={player.photo}/><div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-rtt-red">Public Info</p><label className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/45">Display Name</label><input className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none" value={name} onChange={(e)=>setName(e.target.value)}/><label className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/45">Instagram / Handle</label><input className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none" value={instagram} onChange={(e)=>setInstagram(e.target.value)} placeholder="@handle"/><button disabled={saving} onClick={saveProfile} className="mt-6 w-full rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em] disabled:opacity-50">{saving ? "Saving..." : "Save Profile"}</button><button onClick={()=>router.push(`/players/${player.id}`)} className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.2em]">View Public Profile</button></div></div></main>;
}
