import { useImmer } from "use-immer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { SimulationConfigFormDroneSpeedInput } from "@/components/body/simulation-config-sidebar/simulation-config-form-drone-speed-input";
import { SimulationConfigFormWindVelocityFunctionInput } from "@/components/body/simulation-config-sidebar/simulation-config-form-wind-velocity-function-input";
import { SimulationConfigFormTimeStepInput } from "@/components/body/simulation-config-sidebar/simulation-config-form-time-step-input";
import { SimulationConfigFormStepsInput } from "@/components/body/simulation-config-sidebar/simulation-config-form-steps-input";
import { SimulationConfigFormDroneStartPositionInput } from "@/components/body/simulation-config-sidebar/simulation-config-form-drone-start-position-input";
import {
  ReverseWindVelFuncPresetValues,
  SimulationConfigDtoSchema,
  type FunctionPreset,
} from "@/types/simulation.type";
import { defaults } from "@/lib/defaults";
import { useMutation } from "@tanstack/react-query";
import { runSimulation } from "@/api/simulation.api";
import { useSimulationConfigForm } from "@/hooks/use-simulation-config-form";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { toast } from "sonner";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const SimulationConfigForm: React.FC = () => {
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

  const [functionPreset, setFunctionPreset] = useImmer<FunctionPreset>({
    x: ReverseWindVelFuncPresetValues[defaults.simulationConfig.windVelFuncX],
    y: ReverseWindVelFuncPresetValues[defaults.simulationConfig.windVelFuncY],
    z: ReverseWindVelFuncPresetValues[defaults.simulationConfig.windVelFuncZ],
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col sm:max-w-md">
      <ScrollArea className="min-h-0 w-full flex-1 px-6">
        <div className="mt-4 mb-2 flex flex-col gap-2">
          <h1 className="leading-none font-semibold">Simulation Config</h1>
          <p className="text-muted-foreground text-sm leading-normal font-normal">
            Set your simulation runtime parameters.
          </p>
        </div>
        <form
          id="parameters-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mb-4 flex flex-col gap-4"
        >
          <FieldGroup className="flex flex-col gap-4">
            <Item variant="outline">
              <SimulationConfigFormDroneStartPositionInput form={form} />
              <SimulationConfigFormDroneSpeedInput form={form} />
            </Item>
            <Item variant="outline">
              <SimulationConfigFormTimeStepInput form={form} />
              <SimulationConfigFormStepsInput form={form} />
            </Item>
          </FieldGroup>
          <FieldGroup className="flex flex-col gap-4">
            <Item variant="outline">
              <SimulationConfigFormWindVelocityFunctionInput
                form={form}
                functionPreset={functionPreset}
                setFunctionPreset={setFunctionPreset}
              />
            </Item>
          </FieldGroup>
        </form>
      </ScrollArea>
      <div
        id={TOUR_STEP_IDS.APPLY_SIMULATION_CONFIG_BUTTON}
        className="flex flex-col gap-2 border-t px-6 py-4"
      >
        <div className="flex flex-col gap-2">
          <h1 className="leading-none font-semibold">Run Simulation</h1>
          <p className="text-muted-foreground text-sm leading-normal font-normal">
            If you're done setting your simulation config, click apply to run
            the simulation.
          </p>
        </div>
        <Field orientation="responsive">
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  form="parameters-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Apply"}
                </Button>
              </>
            )}
          </form.Subscribe>
        </Field>
      </div>
    </div>
  );
};

export { SimulationConfigForm };
