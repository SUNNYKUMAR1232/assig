import { describe, expect, it } from "vitest";
import { applications } from "@/data/demo-applications";
import { applyDecision } from "@/lib/decisions/decision.service";

describe("decision rules", () => {
  it("requires correction items for a return", () => {
    const result = applyDecision(applications[0], { action: "RETURN", reason: "दस्तावेज़ आवश्यक" });
    expect(result.ok).toBe(false);
  });
});
