import { RTTSkinShell } from "@/components/rtt-skin/RTTSkinShell";
import { RTTSkinHero } from "@/components/rtt-skin/RTTSkinHero";
import { RTTJoinForm } from "@/components/rtt-skin/RTTJoinForm";
import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

type SafeData = Awaited<ReturnType<typeof getRTTData>>;

async function safeRTTData(): Promise<SafeData | null> {
  try {
    return await getRTTData();
  } catch {
    return null;
  }
}

export default async function JoinPage() {
  const data = await safeRTTData();
  const config = data?.config || {};

  return (
    <RTTSkinShell
      config={config}
      activeHref="/join"
      headerTitle={cfg(config, "join.headerTitle", cfg(config, "skin.headerTitle", "JOIN THE MOVEMENT"))}
      statusLabel={cfg(config, "nav.status", "LIVE")}
      showBack
    >
      <RTTSkinHero
        tagline={cfg(config, "join.subtitle", "CHECK IN. COMPETE. RUN THE TABLE.")}
        wordmarkAlt={cfg(config, "site.name", "Run The Table")}
      />
      <RTTJoinForm config={config} formUrl={data?.formUrl} />
    </RTTSkinShell>
  );
}
