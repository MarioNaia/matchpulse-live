import { NextResponse } from "next/server";
import { footballFetch } from "@/lib/apiFootball";
import { getCachedLiveData, setCachedLiveData } from "@/lib/liveCache";
import { getRequestCount } from "@/lib/requestGuard";
import mockData from "@/data/mock-live-matches.json";

export async function GET() {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({
      source: "mock",
      requestCount: getRequestCount(),
      data: mockData,
    });
  }

  const cached = getCachedLiveData();

  if (cached) {
    return NextResponse.json({
      source: "cache",
      requestCount: getRequestCount(),
      data: cached,
    });
  }

  try {
    const data = await footballFetch("/live/basic/?l=en_US&f=json&e=no");

    setCachedLiveData(data);

    return NextResponse.json({
      source: "api",
      requestCount: getRequestCount(),
      data,
    });
  } catch (error) {
    return NextResponse.json({
      source: "fallback",
      requestCount: getRequestCount(),
      message: error instanceof Error ? error.message : "Unknown error",
      data: mockData,
    });
  }
}