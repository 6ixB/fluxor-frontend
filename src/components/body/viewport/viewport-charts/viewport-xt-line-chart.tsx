import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSimulationStore } from "@/hooks/use-simulation-store";

const ViewPortXTLineChart: React.FC = () => {
  const ts = useSimulationStore.use.ts();
  const xs = useSimulationStore.use.xs();

  const dataLength = Math.min(ts.length, xs.length);
  const data = Array.from({ length: dataLength }, (_, i) => ({
    t: ts[i],
    xs: xs[i],
  }));

  const chartConfig = {
    xs: { label: "X", color: "#00ff00" },
  } satisfies ChartConfig;

  return (
    <Card className="dark:bg-background rounded-lg">
      <CardHeader>
        <CardTitle>X Position vs Time</CardTitle>
        <CardDescription>
          Simulated drone's X-axis position in 3D at each time point.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full min-w-0 overflow-hidden px-0">
        <div className="h-full max-h-96 w-full ps-4 pe-8">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full min-w-0 overflow-hidden"
          >
            <LineChart data={data}>
              <CartesianGrid vertical={false} />
              <YAxis width={40} />
              <XAxis
                dataKey="t"
                type="number"
                tickLine
                axisLine
                tickMargin={8}
                interval="preserveStartEnd"
                tickCount={8}
                domain={["auto", "auto"]}
                tickFormatter={(v) =>
                  typeof v === "number" ? v.toFixed(1) : String(v)
                }
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
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm">Showing x vs t</div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortXTLineChart };
