import { FieldGroup } from "@/components/ui/field";
import { Item } from "@/components/ui/item";
import {
  simulationConfigFormOpts,
  withForm,
} from "@/hooks/use-simulation-config-form";
import { defaults } from "@/lib/defaults";
import {
  ReverseWindVelFuncPresetValues,
  type FunctionPreset,
} from "@/types/simulation.type";
import { useImmer } from "use-immer";
import { SimulationConfigFormDroneSpeedInput } from "./simulation-config-form-drone-speed-input";
import { SimulationConfigFormDroneStartPositionInput } from "./simulation-config-form-drone-start-position-input";
import { SimulationConfigFormStepsInput } from "./simulation-config-form-steps-input";
import { SimulationConfigFormTimeStepInput } from "./simulation-config-form-time-step-input";
import { SimulationConfigFormWindVelocityFunctionInput } from "./simulation-config-form-wind-velocity-function-input";

const SimulationConfigForm = withForm({
  ...simulationConfigFormOpts,
  render: ({ form }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [functionPreset, setFunctionPreset] = useImmer<FunctionPreset>({
      x: ReverseWindVelFuncPresetValues[defaults.simulationConfig.windVelFuncX],
      y: ReverseWindVelFuncPresetValues[defaults.simulationConfig.windVelFuncY],
      z: ReverseWindVelFuncPresetValues[defaults.simulationConfig.windVelFuncZ],
    });

    return (
      <form
        id="parameters-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mb-4 flex flex-col gap-4 px-6"
      >
        <div className="flex h-full min-h-0 w-full flex-col gap-4 sm:max-w-md">
          <div className="mt-4 mb-2 flex flex-col gap-2 p-0">
            <h1 className="text-sm leading-none font-semibold">
              Simulation Config
            </h1>
            <p className="text-muted-foreground text-sm leading-normal font-normal">
              Set your simulation runtime parameters.
            </p>
          </div>
          <FieldGroup className="flex flex-col gap-4">
            <Item
              variant="muted"
              className="border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <SimulationConfigFormDroneStartPositionInput form={form} />
              <SimulationConfigFormDroneSpeedInput form={form} />
            </Item>
            <Item
              variant="muted"
              className="border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <SimulationConfigFormTimeStepInput form={form} />
              <SimulationConfigFormStepsInput form={form} />
            </Item>
          </FieldGroup>
          <FieldGroup className="flex flex-col gap-4">
            <Item
              variant="muted"
              className="border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <SimulationConfigFormWindVelocityFunctionInput
                form={form}
                functionPreset={functionPreset}
                setFunctionPreset={setFunctionPreset}
              />
            </Item>
          </FieldGroup>
        </div>
      </form>
    );
  },
});

export { SimulationConfigForm };
