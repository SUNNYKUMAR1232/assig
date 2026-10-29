import { PortalShell } from "@/components/layout/PortalShell";
import { ReviewScreen } from "@/components/review/ReviewScreen";

export default function AiReviewPage({ params }: { params: { id: string } }) {
  return (
    <PortalShell active="ai">
      <ReviewScreen applicationId={params.id} initialTab="ai_review" />
    </PortalShell>
  );
}
