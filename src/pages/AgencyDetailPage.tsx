
import { useParams, Navigate } from "react-router-dom";
import { AgencyDetailView } from "@/components/agencies/AgencyDetailView";
import { mockAgencies } from "@/data/mockData";

export default function AgencyDetailPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  
  const agency = mockAgencies.find(a => a.id === agencyId);
  
  if (!agency) {
    return <Navigate to="/agencies" replace />;
  }

  return <AgencyDetailView agency={agency} />;
}
