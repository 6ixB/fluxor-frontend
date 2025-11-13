import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  WindVelFuncPreset,
  WindVelFuncPresetValues,
} from "@/types/simulation.type";
import type { FunctionPreset } from "@/types/simulation.type";
import {
  simulationConfigFormOpts,
  withForm,
} from "@/hooks/use-simulation-config-form";
import { Item } from "@/components/ui/item";

const Axis = {
  X: "x",
  Y: "y",
  Z: "z",
} as const;

type Axis = (typeof Axis)[keyof typeof Axis];

type ParametersFormWindVelocityFunctionInputFunctionPresetSelectProps = {
  axis: Axis;
  functionPreset: FunctionPreset;
  setFunctionPreset: (
    value: (draft: FunctionPreset) => void | FunctionPreset,
  ) => void;
};

type WindVelFunc = "windVelFuncX" | "windVelFuncY" | "windVelFuncZ";

const ParametersFormWindVelocityFunctionInputFunctionPresetSelect = withForm({
  ...simulationConfigFormOpts,
  props: {} as ParametersFormWindVelocityFunctionInputFunctionPresetSelectProps,
  render: ({ form, axis, functionPreset, setFunctionPreset }) => {
    return (
      <Select
        value={functionPreset[axis]?.toString()}
        onValueChange={(value: WindVelFuncPreset) => {
          setFunctionPreset((draft) => {
            draft[axis] = value;
          });
          form.setFieldValue(
            `windVelFunc${axis.toUpperCase()}` as WindVelFunc,
            WindVelFuncPresetValues[value],
          );
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Function Preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={WindVelFuncPreset.Linear}>Linear</SelectItem>
          <SelectItem value={WindVelFuncPreset.Sinusoid}>Sinusoid</SelectItem>
          <SelectItem value={WindVelFuncPreset.ExponentialSinusoid}>
            Exponential Sinusoid
          </SelectItem>
          <SelectItem value={WindVelFuncPreset.Custom}>Custom</SelectItem>
        </SelectContent>
      </Select>
    );
  },
});

const listenForFunctionDefinitionChanges = (
  value: string,
  axis: Axis,
  setFunctionPreset: (
    value: (draft: FunctionPreset) => void | FunctionPreset,
  ) => void,
) => {
  if (!Object.values(WindVelFuncPresetValues).includes(value)) {
    setFunctionPreset((draft) => {
      draft[axis] = WindVelFuncPreset.Custom;
    });
  }
};

type ParametersFormWindVelocityFunctionInputProps = {
  functionPreset: FunctionPreset;
  setFunctionPreset: (
    value: (draft: FunctionPreset) => void | FunctionPreset,
  ) => void;
};

const ParametersFormWindVelocityFunctionInput = withForm({
  ...simulationConfigFormOpts,
  props: {} as ParametersFormWindVelocityFunctionInputProps,
  render: ({ form, functionPreset, setFunctionPreset }) => {
    return (
      <Item variant="outline" className="mb-1">
        <FieldGroup>
          <div className="flex flex-col gap-2">
            <h1>3D Wind Velocity Function</h1>
            <p className="text-muted-foreground text-sm leading-normal font-normal">
              Use default presets or define your own wind Velocity function for
              each dimension.
            </p>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="x-axis">
              <AccordionTrigger>
                <div className="flex items-center gap-x-2">
                  X Axis
                  <span className="text-muted-foreground">(Left to Right)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form.Field
                  name="windVelFuncX"
                  listeners={{
                    onChange: ({ value }) =>
                      listenForFunctionDefinitionChanges(
                        value,
                        Axis.X,
                        setFunctionPreset,
                      ),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <ParametersFormWindVelocityFunctionInputFunctionPresetSelect
                          form={form}
                          axis={Axis.X}
                          functionPreset={functionPreset}
                          setFunctionPreset={setFunctionPreset}
                        />
                        <InputGroup>
                          <InputGroupTextarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter a custom function e.g. 0.5*t"
                            rows={6}
                            className="resize-none"
                            aria-invalid={isInvalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              Time variable (t) MUST exist in the function
                              definition (e.g. 0.5*t).
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="y-axis">
              <AccordionTrigger>
                <div className="flex items-center gap-x-2">
                  Y Axis
                  <span className="text-muted-foreground">
                    (Forward to Backward)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form.Field
                  name="windVelFuncY"
                  listeners={{
                    onChange: ({ value }) =>
                      listenForFunctionDefinitionChanges(
                        value,
                        Axis.Y,
                        setFunctionPreset,
                      ),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <ParametersFormWindVelocityFunctionInputFunctionPresetSelect
                          form={form}
                          axis={Axis.Y}
                          functionPreset={functionPreset}
                          setFunctionPreset={setFunctionPreset}
                        />
                        <InputGroup>
                          <InputGroupTextarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter a custom function e.g. 0.5*t"
                            rows={6}
                            className="resize-none"
                            aria-invalid={isInvalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              Time variable (t) MUST exist in the function
                              definition (e.g. 0.5*t).
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="z-axis">
              <AccordionTrigger>
                <div className="flex items-center gap-x-2">
                  Z Axis
                  <span className="text-muted-foreground">(Up to Down)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form.Field
                  name="windVelFuncZ"
                  listeners={{
                    onChange: ({ value }) =>
                      listenForFunctionDefinitionChanges(
                        value,
                        Axis.Z,
                        setFunctionPreset,
                      ),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <ParametersFormWindVelocityFunctionInputFunctionPresetSelect
                          form={form}
                          axis={Axis.Z}
                          functionPreset={functionPreset}
                          setFunctionPreset={setFunctionPreset}
                        />
                        <InputGroup>
                          <InputGroupTextarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter a custom function e.g. 0.5*t"
                            rows={6}
                            className="resize-none"
                            aria-invalid={isInvalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              Time variable (t) MUST exist in the function
                              definition (e.g. 0.5*t).
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FieldGroup>
      </Item>
    );
  },
});

export { ParametersFormWindVelocityFunctionInput };
