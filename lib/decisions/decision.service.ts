import { z } from "zod";
import { Application, DecisionAction } from "@/lib/types";
import { appendAuditEvent } from "@/lib/audit/audit.service";

export const decisionRequestSchema = z.object({
  action: z.enum(["APPROVE", "RETURN", "REJECT"]),
  reason: z.string().trim().min(1),
  correctionItems: z.array(z.string().trim().min(1)).optional(),
});

type DecisionRequest = z.infer<typeof decisionRequestSchema>;

export function applyDecision(application: Application, request: DecisionRequest) {
  if (application.status !== "PENDING_REVIEW" && application.status !== "RETURNED") {
    return { ok: false as const, error: "आवेदन वर्तमान में निर्णय के लिए उपलब्ध नहीं है।" };
  }

  if (request.action === "RETURN" && (!request.correctionItems || request.correctionItems.length === 0)) {
    return { ok: false as const, error: "वापस करने (Return) के लिए सुधार बिंदुओं (correctionItems) का उल्लेख आवश्यक है।" };
  }

  if (request.action === "APPROVE" && application.documents.some((document) => !document.supplied)) {
    return { ok: false as const, error: "स्वीकृति से पहले सभी आवश्यक दस्तावेज़ उपलब्ध होने चाहिए।" };
  }

  const nextStatus: Record<DecisionAction, Application["status"]> = {
    APPROVE: "APPROVED",
    RETURN: "RETURNED",
    REJECT: "REJECTED",
  };

  const auditEvent = appendAuditEvent({
    applicationId: application.id,
    actorId: "राजेश कुमार (नामित अधिकारी)",
    eventType: request.action,
    previousStatus: application.status,
    newStatus: nextStatus[request.action],
    reason: request.reason,
    createdAt: new Date().toISOString(),
  });

  application.status = nextStatus[request.action];

  return {
    ok: true as const,
    previousStatus: auditEvent.previousStatus,
    newStatus: auditEvent.newStatus,
    auditEvent,
  };
}
