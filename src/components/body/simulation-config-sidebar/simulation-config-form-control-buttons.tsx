import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  simulationConfigFormOpts,
  withForm,
} from "@/hooks/use-simulation-config-form";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const SimulationConfigFormControlButtons = withForm({
  ...simulationConfigFormOpts,
  render: ({ form }) => {
    return (
      <div
        id={TOUR_STEP_IDS.APPLY_SIMULATION_CONFIG_BUTTON}
        className="flex flex-col gap-2 border-t px-6 py-4"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-sm leading-none font-semibold">Run Simulation</h1>
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
    );
  },
});

export { SimulationConfigFormControlButtons };
