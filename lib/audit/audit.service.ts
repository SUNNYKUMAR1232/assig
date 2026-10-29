export type AuditEvent = {
  applicationId: string;
  actorId: string;
  eventType: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  createdAt: string;
};

const demoEvents: AuditEvent[] = [
  {
    applicationId: "BR-IC-1007",
    actorId: "राजेश कुमार (नामित अधिकारी)",
    eventType: "RETURNED",
    previousStatus: "PENDING_REVIEW",
    newStatus: "RETURNED",
    reason: "आय संबंधी आवश्यक दस्तावेज़ (बैंक पासबुक/वेतन पर्ची) उपलब्ध नहीं है।",
    createdAt: "2026-10-25T11:32:00+05:30",
  },
  {
    applicationId: "BR-IC-1007",
    actorId: "AI समीक्षा सहायक",
    eventType: "AI_REVIEW",
    previousStatus: "PENDING_REVIEW",
    newStatus: "PENDING_REVIEW",
    reason: "सारांश: आय दस्तावेज़ अनुपलब्ध। सुझाव: वापस करें।",
    createdAt: "2026-10-25T11:20:00+05:30",
  },
  {
    applicationId: "BR-IC-1007",
    actorId: "राजेश कुमार (नामित अधिकारी)",
    eventType: "VERIFICATION",
    previousStatus: "NEW",
    newStatus: "PENDING_REVIEW",
    reason: "दस्तावेज़ जाँच: आंशिक पूर्ण (पहचान एवं निवास सत्यापित)",
    createdAt: "2026-10-25T10:45:00+05:30",
  },
  {
    applicationId: "BR-IC-1007",
    actorId: "प्रणाली (RTPS Portal)",
    eventType: "APPLICATION_RECEIVED",
    previousStatus: "INITIATED",
    newStatus: "NEW",
    reason: "माध्यम: ऑनलाइन (RTPS Portal 2.0)",
    createdAt: "2026-10-25T10:02:00+05:30",
  },
];

export function getAuditEvents(applicationId: string): AuditEvent[] {
  const matched = demoEvents.filter(
    (event) =>
      event.applicationId === applicationId ||
      (applicationId === "rtps-inc-2026-00128" && event.applicationId === "BR-IC-1007")
  );

  if (matched.length > 0) {
    return matched;
  }

  // Generate sensible default timeline for other applications
  return [
    {
      applicationId,
      actorId: "AI समीक्षा सहायक",
      eventType: "AI_REVIEW",
      previousStatus: "PENDING_REVIEW",
      newStatus: "PENDING_REVIEW",
      reason: "स्वचालित सत्यापन एवं दस्तावेज़ मिलान पूर्ण",
      createdAt: new Date().toISOString(),
    },
    {
      applicationId,
      actorId: "राजेश कुमार",
      eventType: "VERIFICATION",
      previousStatus: "NEW",
      newStatus: "PENDING_REVIEW",
      reason: "प्रारंभिक जाँच पूर्ण",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      applicationId,
      actorId: "प्रणाली",
      eventType: "APPLICATION_RECEIVED",
      previousStatus: "INITIATED",
      newStatus: "NEW",
      reason: "माध्यम: ऑनलाइन (RTPS Portal)",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

export function appendAuditEvent(event: AuditEvent) {
  demoEvents.unshift(event);
  return event;
}
