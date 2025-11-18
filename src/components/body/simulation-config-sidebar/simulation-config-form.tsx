import { useImmer } from "use-immer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { runSimulation } from "@/api/simulation.api";
import { useSimulationConfigForm } from "@/hooks/use-simulation-config-form";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { toast } from "sonner";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const SimulationConfigForm: React.FC = () => {
  const setStartPos = useSimulationStore.use.setStartPos();
  const setAll = useSimulationStore.use.setAll();

  const animationResetKey = useSimulationStore.use.animationResetKey();
  const setAnimationResetKey = useSimulationStore.use.setAnimationResetKey();

  const form = useSimulationConfigForm({
    defaultValues: defaults.simulationConfig,
    validators: {
      onSubmit: SimulationConfigDtoSchema,
    },
    onSubmit: async ({ value }) => {
      const submitPromise = (async () => {
        const simulationResult = await runSimulation(value);
        const { x0, y0, z0 } = value;

        setStartPos(x0, y0, z0);
        setAll(simulationResult);

        setAnimationResetKey(animationResetKey + 1);

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
    <Card
      id={TOUR_STEP_IDS.SIMULATION_CONFIG}
      className="flex h-full min-h-0 w-full flex-col border-0 bg-transparent p-0 sm:max-w-md"
    >
      <ScrollArea className="min-h-0 w-full flex-1 pt-6">
        <CardHeader className="mb-6">
          <CardTitle>Simulation Config</CardTitle>
          <CardDescription>
            Set your simulation runtime parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="parameters-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Item variant="outline">
                <SimulationConfigFormDroneStartPositionInput form={form} />
                <SimulationConfigFormDroneSpeedInput form={form} />
              </Item>
              <Item variant="outline">
                <SimulationConfigFormTimeStepInput form={form} />
                <SimulationConfigFormStepsInput form={form} />
              </Item>
            </FieldGroup>
            <SimulationConfigFormWindVelocityFunctionInput
              form={form}
              functionPreset={functionPreset}
              setFunctionPreset={setFunctionPreset}
            />
          </form>
        </CardContent>
      </ScrollArea>
      <div
        id={TOUR_STEP_IDS.APPLY_SIMULATION_CONFIG_BUTTON}
        className="flex flex-col gap-y-3 border-t border-neutral-200 py-6 dark:border-neutral-800"
      >
        <CardHeader>
          <CardTitle>Run Simulation</CardTitle>
          <CardDescription>
            If you're done setting your simulation config, click apply to run
            the simulation.
          </CardDescription>
        </CardHeader>
        <CardFooter>
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
        </CardFooter>
      </div>
    </Card>
  );
};

export { SimulationConfigForm };
