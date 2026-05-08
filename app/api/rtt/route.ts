import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  process.env.RTT_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzPEtTPBALXh_2eb1PaUeXI8DNeT74YW4g05ldRzH049LPAXKAa60oUrz1-pD7hkgZ3/exec";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform";

export const revalidate = 60;

type CachedRTTResponse = {
  data: Record<string, unknown>;
  cachedAt: number;
};

let memoryCache: CachedRTTResponse | null = null;

const MEMORY_CACHE_MS = 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (memoryCache && now - memoryCache.cachedAt < MEMORY_CACHE_MS) {
    return NextResponse.json(
      {
        ...memoryCache.data,
        cache: {
          source: "memory",
          cachedAt: new Date(memoryCache.cachedAt).toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      }
    );
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const fallback = buildEmptyResponse(
        `Apps Script failed with HTTP ${response.status}`
      );

      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=120",
        },
      });
    }

    const text = await response.text();

    let appsScriptData: Record<string, unknown>;

    try {
      appsScriptData = JSON.parse(text) as Record<string, unknown>;
    } catch {
      const fallback = buildEmptyResponse(
        "Apps Script returned non-JSON response."
      );

      return NextResponse.json(
        {
          ...fallback,
          raw: text,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=15, stale-while-revalidate=120",
          },
        }
      );
    }

    const normalizedData: Record<string, unknown> = {
      formUrl: FORM_URL,
      ...appsScriptData,
      fetchedAt: new Date().toISOString(),
    };

    memoryCache = {
      data: normalizedData,
      cachedAt: now,
    };

    return NextResponse.json(
      {
        ...normalizedData,
        cache: {
          source: "apps-script",
          cachedAt: new Date(now).toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    if (memoryCache) {
      return NextResponse.json(
        {
          ...memoryCache.data,
          cache: {
            source: "stale-memory",
            cachedAt: new Date(memoryCache.cachedAt).toISOString(),
          },
          warning:
            error instanceof Error
              ? error.message
              : "Apps Script failed; served stale cache.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
          },
        }
      );
    }

    return NextResponse.json(
      buildEmptyResponse(
        error instanceof Error ? error.message : "Unknown RTT API route error"
      ),
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=120",
        },
      }
    );
  }
}

function buildEmptyResponse(error: string) {
  return {
    ok: false,
    error,
    updatedAt: new Date().toISOString(),
    formUrl: FORM_URL,
    players: [],
    matches: [],
    weeklyResults: [],
    payout: null,
  };
}