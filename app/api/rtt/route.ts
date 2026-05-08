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
      method: "GET",
      next: { revalidate: 60 },
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        buildEmptyResponse(`Apps Script failed with HTTP ${response.status}`, text),
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=15, stale-while-revalidate=120",
          },
        }
      );
    }

    const appsScriptData = parseJsonRecord(text);

    if (!appsScriptData) {
      return NextResponse.json(
        buildEmptyResponse("Apps Script returned non-JSON response.", text),
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

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();

    if (!bodyText) {
      return NextResponse.json(
        {
          ok: false,
          error: "Empty POST body.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const bodyData = parseJsonRecord(bodyText);

    if (!bodyData) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid JSON POST body.",
          raw: bodyText,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const action = String(bodyData.action || "").trim();

    if (!action) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing action.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        /*
         * Google Apps Script web apps are often most reliable with text/plain.
         * Your Apps Script doPost reads e.postData.contents and parses JSON,
         * so text/plain is fine and avoids some CORS/preflight weirdness.
         */
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: bodyText,
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Apps Script POST failed with HTTP ${response.status}`,
          raw: responseText,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const data = parseJsonRecord(responseText);

    if (!data) {
      return NextResponse.json(
        {
          ok: false,
          error: "Apps Script POST returned non-JSON response.",
          raw: responseText,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    /*
     * Any successful POST can change players, matches, users, standings,
     * or setup. Clear memory cache so the next GET pulls fresh Apps Script data.
     */
    memoryCache = null;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown RTT POST route error.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

function parseJsonRecord(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildEmptyResponse(error: string, raw?: string) {
  return {
    ok: false,
    error,
    raw,
    updatedAt: new Date().toISOString(),
    formUrl: FORM_URL,
    players: [],
    matches: [],
    weeklyResults: [],
    payout: null,
  };
}