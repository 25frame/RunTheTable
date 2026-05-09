"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const QR_IMAGE_SRC = "/rtt-join-qr.png";
const QR_TARGET_URL = "https://run-the-table.vercel.app/park";

export default function AdminQRPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  return (
    <AdminShell>
      <section className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="rtt-mini-kicker">Player Check-In</p>

          <h1 className="mt-2 text-5xl font-black italic uppercase leading-[0.85] tracking-[-0.08em] md:text-7xl">
            Scan
            <br />
            To Join
          </h1>

          <p className="mt-4 text-sm font-black uppercase leading-6 tracking-[0.08em] text-white/50">
            Show this screen to a player. They scan the QR and join the next
            battle from their phone.
          </p>
        </div>

        <section className="mt-7 rounded-[2rem] border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <img
            src={QR_IMAGE_SRC}
            alt="QR code to join Run The Table"
            className="h-auto w-full rounded-[1.25rem]"
          />
        </section>

        <section className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-rtt-red">
            QR Destination
          </p>

          <p className="mt-3 break-all text-sm font-bold leading-6 text-white/60">
            {QR_TARGET_URL}
          </p>
        </section>

        <section className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => router.push("/join")}
            className="rtt-cta"
          >
            Open Join Form
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="rtt-secondary"
          >
            Back To Admin
          </button>
        </section>
      </section>
    </AdminShell>
  );
}