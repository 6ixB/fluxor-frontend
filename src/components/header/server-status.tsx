import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/api/health.api";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";

const ServerStatus: React.FC = () => {
  const { data, isError } = useQuery({
    queryKey: ["server-health"],
    queryFn: fetchHealth,
    refetchInterval: 20 * 1000,
    retry: 1,
  });

  const status = data?.status === "ok" && !isError ? "online" : "offline";

  return (
    <div className="flex items-center gap-x-1">
      <span className="text-muted-foreground text-xs">Server status:</span>
      <Status status={status}>
        <StatusIndicator />
        <StatusLabel />
      </Status>
    </div>
  );
};

export { ServerStatus };
