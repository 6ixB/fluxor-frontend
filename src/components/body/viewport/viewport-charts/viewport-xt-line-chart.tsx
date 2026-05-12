import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  xs: { label: "X", color: "#00ff00" },
} satisfies ChartConfig;

const ViewPortXTLineChart: React.FC = () => {
  const ts = useSimulationStore.use.ts();
  const xs = useSimulationStore.use.xs();

  const data = useMemo(() => {
    const dataLength = Math.min(ts.length, xs.length);
    const out = new Array(dataLength);
    for (let i = 0; i < dataLength; i++) out[i] = { t: ts[i], xs: xs[i] };
    return out;
  }, [ts, xs]);

  return (
    <Card className="dark:bg-background flex aspect-square w-full flex-col rounded-md">
      <CardHeader>
        <CardDescription>
          Simulated drone's X-axis position in 3D at each time point.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pl-0">
        <ChartContainer config={chartConfig} className="pr-2">
          <LineChart data={data}>
            <CartesianGrid />
            <YAxis
              dataKey="xs"
              type="number"
              tickLine
              axisLine
              tickMargin={8}
              tickCount={8}
            />
            <XAxis
              dataKey="t"
              type="number"
              tickLine
              axisLine
              tickMargin={8}
              tickCount={8}
            />
            <ChartTooltip
              cursor
              content={<ChartTooltipContent />}
              wrapperStyle={{ pointerEvents: "none" }}
            />
            <Line
              dataKey="xs"
              type="monotone"
              stroke="#00ff00"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm font-semibold">
          Showing x vs t
        </div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortXTLineChart };
