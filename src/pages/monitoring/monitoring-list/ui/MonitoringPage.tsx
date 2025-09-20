import { useGetEventsQuery } from "@/entities/monitoring";
import { MonitoringTable } from "@/widgets/MonitoringTable";

export function MonitoringPage() {
  const { data: events = [], isLoading } = useGetEventsQuery();

  return <MonitoringTable events={events} isLoading={isLoading} />;
}
