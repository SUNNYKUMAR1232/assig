import { NextResponse } from "next/server";
import { getApplicationAsync } from "@/lib/applications/application.service";
import { generateGroqAiReview } from "@/lib/ai/ai-review.service";
import { verifyApplication } from "@/lib/validation/verification.service";

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
    const verification = verifyApplication(application);
    const aiReview = await generateGroqAiReview(application, verification);
    return NextResponse.json(aiReview);
  } catch (error) {
    return NextResponse.json(
      { error: "AI Review failed", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await getApplicationAsync(params.id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    const verification = verifyApplication(application);
    const aiReview = await generateGroqAiReview(application, verification);
    return NextResponse.json(aiReview);
  } catch (error) {
    return NextResponse.json(
      { error: "AI Review failed", details: String(error) },
      { status: 500 }
    );
  }
}
