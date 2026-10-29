export type ApplicationStatus =
  | "PENDING_REVIEW"
  | "RETURNED"
  | "APPROVED"
  | "REJECTED";

export type DecisionAction = "APPROVE" | "RETURN" | "REJECT";

export type DocumentRecord = {
  type: string;
  supplied: boolean;
  verificationStatus: "PENDING" | "VERIFIED" | "MISSING";
  finding?: string;
};

export type Application = {
  id: string;
  numericId?: number;
  name: string;
  fatherName?: string;
  village: string;
  district?: string;
  block?: string;
  referenceNumber: string;
  service?: string;
  submittedAt: string;
  status: ApplicationStatus;
  priority: "तात्कालिक" | "सामान्य";
  financialYear: string;
  declaredIncome: number;
  documents: DocumentRecord[];
};

/** Dashboard-specific application shape used in the priority table */
export type DashboardApplication = {
  id: number;
  appNo: string;
  name: string;
  service: string;
  income: string;
  status: string;
  statusColor: string;
  date: string;
};
