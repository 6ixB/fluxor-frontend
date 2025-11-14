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
import { ParametersFormDroneSpeedInput } from "@/components/body/parameters-sidebar/parameters-form-drone-speed-input";
import { ParametersFormWindVelocityFunctionInput } from "@/components/body/parameters-sidebar/parameters-form-wind-velocity-function-input";
import { ParametersFormTimeStepInput } from "@/components/body/parameters-sidebar/parameters-form-time-step-input";
import { ParametersFormStepsInput } from "@/components/body/parameters-sidebar/parameters-form-steps-input";
import { ParametersFormDroneStartPositionInput } from "@/components/body/parameters-sidebar/parameters-form-drone-start-position-input";
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

const ParametersForm: React.FC = () => {
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
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      const submitPromise = (async () => {
        await delay(250);

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
        error: "Error",
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
    <Card className="flex h-full min-h-0 w-full flex-col border-0 bg-transparent p-0 sm:max-w-md">
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
                <ParametersFormDroneStartPositionInput form={form} />
                <ParametersFormDroneSpeedInput form={form} />
              </Item>
              <Item variant="outline">
                <ParametersFormTimeStepInput form={form} />
                <ParametersFormStepsInput form={form} />
              </Item>
            </FieldGroup>
            <ParametersFormWindVelocityFunctionInput
              form={form}
              functionPreset={functionPreset}
              setFunctionPreset={setFunctionPreset}
            />
          </form>
        </CardContent>
      </ScrollArea>
      <div className="flex flex-col gap-y-3 border-t border-neutral-200 py-6 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>Run Simulation</CardTitle>
          <CardDescription>
            If you're done setting youre simulation config, click apply to run
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

export { ParametersForm };
