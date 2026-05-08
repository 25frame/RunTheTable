import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  process.env.RTT_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzPEtTPBALXh_2eb1PaUeXI8DNeT74YW4g05ldRzH049LPAXKAa60oUrz1-pD7hkgZ3/exec";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?ts=${Date.now()}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Apps Script failed with HTTP ${response.status}`,
          updatedAt: new Date().toISOString(),
          formUrl: FORM_URL,
          players: [],
          matches: [],
          weeklyResults: [],
          payout: null,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "s-maxage=15, stale-while-revalidate=120",
          },
        }
      );
    }

    const text = await response.text();

    let data: Record<string, unknown>;

    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Apps Script returned non-JSON response.",
          raw: text,
          updatedAt: new Date().toISOString(),
          formUrl: FORM_URL,
          players: [],
          matches: [],
          weeklyResults: [],
          payout: null,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "s-maxage=15, stale-while-revalidate=120",
          },
        }
      );
    }

    return NextResponse.json(
      {
        formUrl: FORM_URL,
        ...data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=30, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown RTT API route error",
        updatedAt: new Date().toISOString(),
        formUrl: FORM_URL,
        players: [],
        matches: [],
        weeklyResults: [],
        payout: null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=15, stale-while-revalidate=120",
        },
      }
    );
  }
}