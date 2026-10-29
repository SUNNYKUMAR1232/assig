import { NextResponse } from "next/server";
import { getAllApplicationsAsync } from "@/lib/applications/application.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const applications = await getAllApplicationsAsync();
    return NextResponse.json({
      applications,
      total: applications.length,
      source: "neon_postgresql",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications from database", details: String(error) },
      { status: 500 }
    );
  }
}
