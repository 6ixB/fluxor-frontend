import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import Plot from "react-plotly.js";

const ViewPortXYZLineChart: React.FC = () => {
  const xs = useSimulationStore.use.xs();
  const ys = useSimulationStore.use.ys();
  const zs = useSimulationStore.use.zs();

  return (
    <Card className="dark:bg-background flex aspect-square w-full flex-col rounded-md">
      <CardHeader>
        <CardDescription>Simulated drone's trajectory.</CardDescription>
      </CardHeader>

      <CardContent className="relative flex-1">
        <Plot
          data={[
            {
              x: xs,
              y: ys,
              z: zs,
              mode: "lines",
              type: "scatter3d",
              line: { width: 4, color: "#00ff00" },
              marker: { size: 4 },
            },
          ]}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, t: 0, b: 0 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            scene: {
              xaxis: { title: { text: "X" } },
              yaxis: { title: { text: "Z" } },
              zaxis: { title: { text: "Y" } },
              bgcolor: "rgba(0,0,0,0)",
            },
            hovermode: false,
          }}
          config={{ staticPlot: false }}
          style={{ position: "absolute", inset: 0 }}
          useResizeHandler
        />
      </CardContent>

      <CardFooter>
        <div className="text-muted-foreground text-sm font-semibold">
          Showing bs vs t
        </div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortXYZLineChart };
