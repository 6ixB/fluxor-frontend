import { defaults } from "@/lib/defaults";
import { fieldContext, formContext } from "@/lib/form-context";
import { createFormHook, formOptions } from "@tanstack/react-form";

const simulationConfigFormOpts = formOptions({
  defaultValues: defaults.simulationConfig,
});

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});

export {
  simulationConfigFormOpts,
  useAppForm as useSimulationConfigForm,
  withForm,
};
