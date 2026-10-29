import { NextResponse } from "next/server";
import { getApplicationAsync } from "@/lib/applications/application.service";
import { getAuditEventsFromDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const application = await getApplicationAsync(params.id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const events = await getAuditEventsFromDb(application.id);
  return NextResponse.json({ applicationId: application.id, events });
}
