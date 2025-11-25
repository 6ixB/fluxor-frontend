import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import Plot from "react-plotly.js";

const ViewPortXYZLineChart: React.FC = () => {
  const xs = useSimulationStore.use.xs();
  const ys = useSimulationStore.use.ys();
  const zs = useSimulationStore.use.zs();

  return (
    <Card className="dark:bg-background col-span-2 row-span-2 h-full w-full rounded-lg">
      <CardHeader>
        <CardTitle>Trajectory</CardTitle>
        <CardDescription>Simulated drone's trajectory.</CardDescription>
      </CardHeader>
      <CardContent className="h-full w-full">
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
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm">Showing x, y, z</div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortXYZLineChart };
