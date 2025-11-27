import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/api/health.api";
import { Item } from "@/components/ui/item";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";

const ServerStatus: React.FC = () => {
  const { data, isError } = useQuery({
    queryKey: ["fetch-server-health"],
    queryFn: fetchHealth,
    refetchInterval: 30 * 1000,
  });

  const status = data?.status === "ok" && !isError ? "online" : "offline";

  return (
    <Item className="absolute top-4 right-4 flex items-center gap-x-2 rounded-sm px-3 py-1">
      <span className="text-muted-foreground hidden text-xs sm:block">
        Server status
      </span>
      <Status status={status}>
        <StatusIndicator />
        <StatusLabel />
      </Status>
    </Item>
  );
};

export { ServerStatus };
