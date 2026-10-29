import { NextResponse } from "next/server";
import { getApplicationAsync } from "@/lib/applications/application.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await getApplicationAsync(params.id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error retrieving application", details: String(error) },
      { status: 500 }
    );
  }
}
