"use client";

import type { RTTData } from "@/lib/googleData";
import { normalizeSkinId } from "@/lib/skins";
import { useEffect } from "react";

export function ThemeRuntime() {
  useEffect(() => {
    let cancelled = false;

    async function loadSkin() {
      try {
        const response = await fetch("/api/rtt", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          document.documentElement.dataset.rttSkin = "default";
          return;
        }

        const data = (await response.json()) as RTTData;
        const skin = normalizeSkinId(data.config?.["theme.activeSkin"]);

        if (!cancelled) {
          document.documentElement.dataset.rttSkin = skin;
        }
      } catch {
        if (!cancelled) {
          document.documentElement.dataset.rttSkin = "default";
        }
      }
    }

    document.documentElement.dataset.rttSkin =
      document.documentElement.dataset.rttSkin || "default";

    loadSkin();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
