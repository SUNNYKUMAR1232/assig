import { Application } from "@/lib/types";

export type VerificationFinding = {
  ruleCode: string;
  severity: "WARNING" | "INFO";
  description: string;
  sourceReference: string;
};
export type VerificationResult = {
  applicationId: string;
  findings: VerificationFinding[];
};
export function verifyApplication(application: Application) {
  const findings: VerificationFinding[] = [];
  if (!application.financialYear)
    findings.push({
      ruleCode: "REQUIRED_FINANCIAL_YEAR",
      severity: "WARNING",
      description: "वित्तीय वर्ष उपलब्ध नहीं है।",
      sourceReference: "Configured application rules",
    });
  for (const document of application.documents.filter((item) => !item.supplied))
    findings.push({
      ruleCode: "MISSING_DOCUMENT",
      severity: "WARNING",
      description: `${document.type} उपलब्ध नहीं है।`,
      sourceReference: "Configured document checklist",
    });
  return {
    applicationId: application.id,
    findings,
  } satisfies VerificationResult;
}
