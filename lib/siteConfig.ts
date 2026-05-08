import type { RTTConfig } from "@/lib/googleData";

export type SiteConfig = RTTConfig;

export function cfg(
  config: SiteConfig | undefined,
  key: string,
  fallback: string
): string {
  const value = config?.[key];
  return value && value.trim() ? value : fallback;
}

export function pickConfigGroup(
  config: SiteConfig | undefined,
  prefix: string
): Record<string, string> {
  const output: Record<string, string> = {};

  if (!config) return output;

  Object.entries(config).forEach(([key, value]) => {
    if (key.startsWith(prefix)) {
      output[key] = value;
    }
  });

  return output;
}