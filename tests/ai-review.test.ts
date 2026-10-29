import { describe, expect, it } from "vitest";
import { applications } from "@/data/demo-applications";
import { verifyApplication } from "@/lib/validation/verification.service";
import { generateGroqAiReview, createAiReview } from "@/lib/ai/ai-review.service";

describe("Groq AI Review Integration", () => {
  it("generates structured scrutiny review for application with missing documents", async () => {
    const app = applications[0]; // BR-IC-1007 (missing salary slip/passbook)
    const verification = verifyApplication(app);

    const review = await generateGroqAiReview(app, verification);

    expect(review.available).toBe(true);
    expect(review.summaryHindi).toBeTruthy();
    expect(typeof review.summaryHindi).toBe("string");
    expect(review.suggestedAction).toBe("RETURN");
    expect(review.missingEvidence.length).toBeGreaterThan(0);
    expect(review.modelVersion).toContain("groq");
  }, 15000);

  it("fallback function generates compliant Hindi summary", () => {
    const app = applications[0];
    const verification = verifyApplication(app);
    const review = createAiReview(app, verification);

    expect(review.available).toBe(true);
    expect(review.suggestedAction).toBe("RETURN");
  });
});

