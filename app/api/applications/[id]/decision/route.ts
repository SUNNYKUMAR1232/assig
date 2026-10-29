import { NextResponse } from "next/server";
import { getApplicationAsync } from "@/lib/applications/application.service";
import { applyDecision, decisionRequestSchema } from "@/lib/decisions/decision.service";
import { updateApplicationDecisionInDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const application = await getApplicationAsync(params.id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = decisionRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = applyDecision(application, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  // Persist decision into Neon PostgreSQL
  try {
    await updateApplicationDecisionInDb(
      application.id,
      result.newStatus,
      result.previousStatus,
      parsed.data.action,
      "राजेश कुमार (नामित अधिकारी)",
      parsed.data.reason
    );
  } catch (dbError) {
    console.error("Failed to persist decision to Neon PostgreSQL:", dbError);
  }

  return NextResponse.json(result);
}
