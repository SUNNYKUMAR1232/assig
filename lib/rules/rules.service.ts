export type ApplicableRule = {
  code: string;
  title: string;
  sourceReference: string;
  effectiveFrom: string;
  serviceType: "INCOME_CERTIFICATE";
};

export const incomeCertificateRules: ApplicableRule[] = [
  {
    code: "INCOME_DOCUMENT_CHECKLIST",
    title: "आय-संबंधी आवश्यक दस्तावेज़",
    sourceReference: "Configured demo checklist; simulated for assessment",
    effectiveFrom: "2025-04-01",
    serviceType: "INCOME_CERTIFICATE",
  },
  {
    code: "FINANCIAL_YEAR_REQUIRED",
    title: "वित्तीय वर्ष आवश्यक है",
    sourceReference: "Configured application validation; simulated for assessment",
    effectiveFrom: "2025-04-01",
    serviceType: "INCOME_CERTIFICATE",
  },
];

export function getApplicableRules(serviceType: ApplicableRule["serviceType"], asOf = new Date()) {
  const date = asOf.toISOString().slice(0, 10);
  return incomeCertificateRules.filter((rule) => rule.serviceType === serviceType && rule.effectiveFrom <= date);
}
