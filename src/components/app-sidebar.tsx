import { runSimulation } from "@/api/simulation.api";
import { SimulationConfigForm } from "@/components/body/simulation-config-sidebar/simulation-config-form";
import { SimulationConfigFormControlButtons } from "@/components/body/simulation-config-sidebar/simulation-config-form-control-buttons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSimulationConfigForm } from "@/hooks/use-simulation-config-form";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { defaults } from "@/lib/defaults";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { SimulationConfigDtoSchema } from "@/types/simulation.type";
import { useMutation } from "@tanstack/react-query";
import { DroneIcon } from "lucide-react";
import { toast } from "sonner";

const AppSidebar: React.FC = () => {
  const setStartPos = useSimulationStore.use.setStartPos();
  const setTimeStep = useSimulationStore.use.setTimeStep();
  const setAll = useSimulationStore.use.setAll();

  const animationResetKey = useSimulationStore.use.animationResetKey();
  const setAnimationResetKey = useSimulationStore.use.setAnimationResetKey();
  const setAnimationMaxStep = useSimulationStore.use.setAnimationMaxStep();

  const runSimulationMutation = useMutation({
    mutationKey: ["run-simulation"],
    mutationFn: runSimulation,
  });

  const form = useSimulationConfigForm({
    defaultValues: defaults.simulationConfig,
    validators: {
      onSubmit: SimulationConfigDtoSchema,
    },
    onSubmit: async ({ value }) => {
      const submitPromise = (async () => {
        const simulationResult = await runSimulationMutation.mutateAsync(value);
        const { x0, y0, z0, timeStep, steps } = value;

        setStartPos(x0, y0, z0);
        setTimeStep(timeStep);
        setAll(simulationResult);

        setAnimationResetKey(animationResetKey + 1);
        setAnimationMaxStep(steps);

        return simulationResult;
      })();

      toast.promise(submitPromise, {
        loading: "Applying...",
        success: "Simulation configuration has been applied!",
        error: "Something went wrong :(",
      });

      return submitPromise;
    },
  });

  return (
    <Sidebar id={TOUR_STEP_IDS.SIMULATION_CONFIG}>
      <SidebarHeader className="bg-background border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 select-none">
            <DroneIcon className="size-[1.2rem]" />
            <span className="text-lg font-semibold">Fluxor</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SimulationConfigForm form={form} />
      </SidebarContent>
      <SidebarFooter className="bg-background p-0">
        <SimulationConfigFormControlButtons form={form} />
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
