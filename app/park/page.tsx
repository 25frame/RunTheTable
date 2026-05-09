import { RTTSkinShell } from "@/components/rtt-skin/RTTSkinShell";
import { RTTSkinHero } from "@/components/rtt-skin/RTTSkinHero";
import { RTTGlassPanel } from "@/components/rtt-skin/RTTGlassPanel";
import { RTTPrimaryLink, RTTSecondaryLink } from "@/components/rtt-skin/RTTButtons";
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

export default async function ParkPage() {
  const data = await safeRTTData();
  const config = data?.config || {};

  return (
    <RTTSkinShell
      config={config}
      activeHref="/park"
      headerTitle={cfg(config, "park.headerTitle", "TABLE CHECK")}
      statusLabel={cfg(config, "nav.status", "LIVE")}
      showBack={false}
    >
      <RTTSkinHero
        tagline={cfg(config, "park.subtitle", "You found the table. Check in, compete, and get on the board.")}
        wordmarkAlt={cfg(config, "site.name", "Run The Table")}
      />

      <div className="rttb-stack">
        <RTTGlassPanel>
          <span className="rttb-mini-kicker">{cfg(config, "park.kicker", "QR LANDING")}</span>
          <h1 className="rttb-panel-title">{cfg(config, "park.title", "Table Check")}</h1>
          <p className="rttb-panel-subtitle">
            {cfg(config, "park.body", "Lock in your player info and join the next available battle.")}
          </p>

          <div className="rttb-stack" style={{ marginTop: 16 }}>
            <RTTPrimaryLink href="/join">{cfg(config, "park.primaryCta", "CHECK-IN NOW")}</RTTPrimaryLink>
            <RTTSecondaryLink href="/standings">{cfg(config, "park.secondaryCtaBoard", "VIEW THE BOARD")}</RTTSecondaryLink>
          </div>
        </RTTGlassPanel>

        <RTTGlassPanel>
          <span className="rttb-mini-kicker">{cfg(config, "park.howItWorksKicker", "HOW IT WORKS")}</span>
          <div className="rttb-step-list">
            <div className="rttb-step">
              <div className="rttb-step-number">1</div>
              <div>
                <strong>{cfg(config, "park.step1Title", "Check In")}</strong>
                <span>{cfg(config, "park.step1Text", "Add your name, contact info, and skill level.")}</span>
              </div>
            </div>
            <div className="rttb-step">
              <div className="rttb-step-number">2</div>
              <div>
                <strong>{cfg(config, "park.step2Title", "Get Matched")}</strong>
                <span>{cfg(config, "park.step2Text", "Admin assigns battles and keeps score live.")}</span>
              </div>
            </div>
            <div className="rttb-step">
              <div className="rttb-step-number">3</div>
              <div>
                <strong>{cfg(config, "park.step3Title", "Run The Table")}</strong>
                <span>{cfg(config, "park.step3Text", "Final wins move you up the public board.")}</span>
              </div>
            </div>
          </div>
        </RTTGlassPanel>
      </div>
    </RTTSkinShell>
  );
}
