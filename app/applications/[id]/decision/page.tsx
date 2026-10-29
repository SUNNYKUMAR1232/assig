import { PortalShell } from "@/components/layout/PortalShell";
import { ReviewScreen } from "@/components/review/ReviewScreen";

export default function DecisionPage({ params }: { params: { id: string } }) {
  return (
    <PortalShell active="review">
      <ReviewScreen applicationId={params.id} initialTab="decision" />
    </PortalShell>
  );
}
