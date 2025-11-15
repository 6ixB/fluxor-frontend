import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/lib/form-context";
import { formOptions } from "@tanstack/react-form";
import { defaults } from "@/lib/defaults";

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
  useAppForm as useSimulationConfigForm,
  withForm,
  simulationConfigFormOpts,
};
