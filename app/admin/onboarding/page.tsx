"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const operatorSteps = [
  {
    title: "Check Health",
    text: "Open Health and confirm all required backend tabs exist.",
    href: "/admin/health",
  },
  {
    title: "Create Players",
    text: "Use Create Player instead of editing Google Sheets.",
    href: "/admin/create-player",
  },
  {
    title: "Create Battle",
    text: "Use Create Battle to schedule Player A vs Player B.",
    href: "/admin/create-match",
  },
  {
    title: "Score Live",
    text: "Use Live Scoring. Every tap can update the public Live page.",
    href: "/admin/matches",
  },
  {
    title: "Recalculate Board",
    text: "Use Admin Control to sync and recalc after changes.",
    href: "/admin/control",
  },
];

export default function AdminOnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <p className="rtt-kicker">Operator Training</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Admin Onboarding</h1>

      <div className="mt-6">
        <AdminNotice title="Operating Principle" tone="success">
          Admins operate from the website. Google Sheets stays in the background as the database and emergency fallback.
        </AdminNotice>
      </div>

      <div className="mt-8 grid gap-4">
        {operatorSteps.map((step, index) => (
          <button
            key={step.title}
            onClick={() => router.push(step.href)}
            className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 text-left transition active:scale-[0.985]"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-3xl font-black italic uppercase tracking-[-0.06em]">
              {step.title}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
              {step.text}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AdminNotice title="Do Not Do This" tone="warning">
          Do not rename tabs, move sheet columns, or create duplicate doPost/doGet functions in Apps Script.
        </AdminNotice>
      </div>
    </AdminShell>
  );
}
