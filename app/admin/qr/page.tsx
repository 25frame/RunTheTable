"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RTTGlassPanel } from "@/components/rtt-skin/RTTGlassPanel";

export default function AdminQRPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("rtt_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role !== "admin") {
        router.replace("/login");
        return;
      }
      setReady(true);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!ready) {
    return (
      <main className="rttb-admin-stage" data-rtt-skin="battle-black">
        <div className="rttb-admin-frame">
          <RTTGlassPanel>
            <span className="rttb-mini-kicker">Admin</span>
            <h1 className="rttb-panel-title">Checking Access</h1>
            <p className="rttb-panel-subtitle">Confirming admin session.</p>
          </RTTGlassPanel>
        </div>
      </main>
    );
  }

  return (
    <main className="rttb-admin-stage" data-rtt-skin="battle-black">
      <div className="rttb-admin-frame">
        <RTTGlassPanel>
          <span className="rttb-mini-kicker">Admin QR</span>
          <h1 className="rttb-panel-title">Player Check-In QR</h1>
          <p className="rttb-panel-subtitle">
            Show this screen at the table. Players scan it and land on /park, then check in through /join.
          </p>

          <div className="rttb-admin-qr">
            <img src="/rtt-join-qr.png" alt="Run The Table check-in QR code" />
          </div>

          <div className="rttb-stack" style={{ marginTop: 18 }}>
            <Link className="rttb-primary-cta" href="/park">
              OPEN PUBLIC QR LANDING
            </Link>
            <Link className="rttb-secondary-cta" href="/admin/dashboard">
              BACK TO ADMIN DASHBOARD
            </Link>
          </div>
        </RTTGlassPanel>
      </div>
    </main>
  );
}
