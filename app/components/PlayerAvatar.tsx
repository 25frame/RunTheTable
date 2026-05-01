import type { RTTPlayer } from "@/lib/googleData";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "RTT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PlayerAvatar({ player }: { player: Pick<RTTPlayer, "name" | "photo"> }) {
  const hasPhoto = player.photo && player.photo.trim() !== "";
  const initials = getInitials(player.name || "RTT");

  if (hasPhoto) {
    return (
      <img
        src={player.photo}
        alt={player.name}
        className="h-full w-full object-cover grayscale transition group-hover:grayscale-0"
      />
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <img src="/rtt-logo.png" alt="RTT NYC" className="absolute inset-0 h-full w-full object-contain p-5 opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-br from-rtt-red/25 via-black/30 to-black" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-black/75 shadow-2xl shadow-black/60">
        <span className="text-4xl font-black italic tracking-[-0.08em] text-white">{initials}</span>
      </div>
    </div>
  );
}
