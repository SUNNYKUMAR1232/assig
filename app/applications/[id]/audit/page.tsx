import { PortalShell } from "@/components/layout/PortalShell";
import { ReviewScreen } from "@/components/review/ReviewScreen";

export default function AuditPage({ params }: { params: { id: string } }) {
  return (
    <PortalShell active="audit">
      <ReviewScreen applicationId={params.id} initialTab="decision" />
    </PortalShell>
  );
}
