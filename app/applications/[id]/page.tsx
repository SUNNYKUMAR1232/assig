import { PortalShell } from "@/components/layout/PortalShell";
import { ReviewScreen } from "@/components/review/ReviewScreen";

export default function ApplicationPage({ params }: { params: { id: string } }) {
  return <PortalShell active="review"><ReviewScreen applicationId={params.id} /></PortalShell>;
}
