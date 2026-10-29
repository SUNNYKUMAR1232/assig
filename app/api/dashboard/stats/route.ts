import { NextResponse } from "next/server";
import { getDashboardStatsAsync } from "@/lib/applications/application.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getDashboardStatsAsync();
    return NextResponse.json({ ...stats, source: "neon_postgresql" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats from database", details: String(error) },
      { status: 500 }
    );
  }
}
