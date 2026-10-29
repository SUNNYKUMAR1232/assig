import { describe, expect, it } from "vitest";
import { applications } from "@/data/demo-applications";
import { verifyApplication } from "@/lib/validation/verification.service";

describe("verification rules", () => {
  it("distinguishes missing evidence from eligibility", () => {
    expect(verifyApplication(applications[0]).findings[0].ruleCode).toBe("MISSING_DOCUMENT");
  });
});
