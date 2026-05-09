export type RTTSkinId = "default" | "street-red";

export type RTTSkin = {
  id: RTTSkinId;
  label: string;
  description: string;
  vibe: string;
};

export const RTT_SKINS: RTTSkin[] = [
  {
    id: "default",
    label: "RTT Default",
    description:
      "Current production look: black base, red action color, clean mobile-first UI.",
    vibe: "Core / stable / default",
  },
  {
    id: "street-red",
    label: "Street Red",
    description:
      "Higher-impact street package with stronger red surfaces, heavier contrast, and broadcast-style aggression.",
    vibe: "Street / loud / black-red",
  },
];

export function normalizeSkinId(value: unknown): RTTSkinId {
  const skin = String(value ?? "").trim().toLowerCase();

  if (skin === "street-red") return "street-red";

  return "default";
}

export function getSkinLabel(id: RTTSkinId): string {
  return RTT_SKINS.find((skin) => skin.id === id)?.label || "RTT Default";
}
