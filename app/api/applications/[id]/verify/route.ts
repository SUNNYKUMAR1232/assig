import { NextResponse } from "next/server";
import { getApplication } from "@/lib/applications/application.service";
import { verifyApplication } from "@/lib/validation/verification.service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const application = getApplication(params.id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  return NextResponse.json(verifyApplication(application));
}
