import { useStore } from "@tanstack/react-form";
import { Field, FieldError } from "@/components/ui/field";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ReverseWindVelFuncPresetValues,
  WindVelFuncPreset,
  WindVelFuncPresetValues,
} from "@/types/simulation.type";
import type { FunctionPreset } from "@/types/simulation.type";
import {
  simulationConfigFormOpts,
  withForm,
} from "@/hooks/use-simulation-config-form";
import { PiIcon, VariableIcon } from "lucide-react";
import { useEffect } from "react";

const Axis = {
  X: "x",
  Y: "y",
  Z: "z",
} as const;

type Axis = (typeof Axis)[keyof typeof Axis];

type SimulationConfigFormWindVelocityFunctionInputFunctionPresetSelectProps = {
  axis: Axis;
  functionPreset: FunctionPreset;
  setFunctionPreset: (
    value: (draft: FunctionPreset) => void | FunctionPreset,
  ) => void;
};

type WindVelFunc = "windVelFuncX" | "windVelFuncY" | "windVelFuncZ";

const SimulationConfigFormWindVelocityFunctionInputFunctionPresetSelect =
  withForm({
    ...simulationConfigFormOpts,
    props:
      {} as SimulationConfigFormWindVelocityFunctionInputFunctionPresetSelectProps,
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
          <SelectTrigger className="w-full bg-neutral-50">
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

type SimulationConfigFormWindVelocityFunctionInputProps = {
  functionPreset: FunctionPreset;
  setFunctionPreset: (
    value: (draft: FunctionPreset) => void | FunctionPreset,
  ) => void;
};

type SupportedMathFunction = {
  display: string; // what shows in the table
};

const SUPPORTED_MATH_FUNCTIONS: Record<string, SupportedMathFunction[]> = {
  Trigonometric: [
    { display: "sin(t)" },
    { display: "cos(t)" },
    { display: "tan(t)" },
    { display: "asin(t)" },
    { display: "acos(t)" },
    { display: "atan(t)" },
  ],
  Hyperbolic: [
    { display: "sinh(t)" },
    { display: "cosh(t)" },
    { display: "tanh(t)" },
  ],
  "Exponential / Logarithmic": [
    { display: "exp(t)" },
    { display: "log(t)" },
    { display: "log10(t)" },
  ],
  "Roots & Powers": [{ display: "sqrt(t)" }, { display: "pow(t, n)" }],
  Miscellaneous: [
    { display: "fabs(t)" },
    { display: "floor(t)" },
    { display: "ceil(t)" },
  ],
  "Optional Convenience": [
    { display: "abs(t)" },
    { display: "min(t, value)" },
    { display: "max(t, value)" },
  ],
} as const;

const SUPPORTED_MATH_CONSTANTS = {
  Constants: ["pi", "e"],
} as const;

const SimulationConfigFormWindVelocityFunctionInput = withForm({
  ...simulationConfigFormOpts,
  props: {} as SimulationConfigFormWindVelocityFunctionInputProps,
  render: ({ form, functionPreset, setFunctionPreset }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const windVelFuncX = useStore(
      form.store,
      (state) => state.values.windVelFuncX,
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const windVelFuncY = useStore(
      form.store,
      (state) => state.values.windVelFuncY,
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const windVelFuncZ = useStore(
      form.store,
      (state) => state.values.windVelFuncZ,
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const windVelFuncXPreset =
        ReverseWindVelFuncPresetValues[windVelFuncX] ??
        WindVelFuncPreset.Custom;

      const windVelFuncYPreset =
        ReverseWindVelFuncPresetValues[windVelFuncY] ??
        WindVelFuncPreset.Custom;

      const windVelFuncZPreset =
        ReverseWindVelFuncPresetValues[windVelFuncZ] ??
        WindVelFuncPreset.Custom;

      setFunctionPreset((draft) => {
        draft.x = windVelFuncXPreset;
        draft.y = windVelFuncYPreset;
        draft.z = windVelFuncZPreset;
      });
    }, [setFunctionPreset, windVelFuncX, windVelFuncY, windVelFuncZ]);

    return (
      <>
        <div className="flex flex-col gap-2">
          <h1 className="leading-none font-semibold">
            3D Wind Velocity Function
          </h1>
          <p className="text-muted-foreground text-sm leading-normal font-normal">
            Use default presets or define your own wind Velocity function for
            each dimension.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
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
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <SimulationConfigFormWindVelocityFunctionInputFunctionPresetSelect
                        form={form}
                        axis={Axis.X}
                        functionPreset={functionPreset}
                        setFunctionPreset={setFunctionPreset}
                      />
                      <InputGroup className="bg-neutral-50">
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
                            definition (e.g. 0.5 * t).
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
                <span className="text-muted-foreground">(Up to Down)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form.Field
                name="windVelFuncY"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <SimulationConfigFormWindVelocityFunctionInputFunctionPresetSelect
                        form={form}
                        axis={Axis.Y}
                        functionPreset={functionPreset}
                        setFunctionPreset={setFunctionPreset}
                      />
                      <InputGroup className="bg-neutral-50">
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
                            definition (e.g. 0.5 * t).
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
                <span className="text-muted-foreground">
                  (Forward to Backward)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form.Field
                name="windVelFuncZ"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <SimulationConfigFormWindVelocityFunctionInputFunctionPresetSelect
                        form={form}
                        axis={Axis.Z}
                        functionPreset={functionPreset}
                        setFunctionPreset={setFunctionPreset}
                      />
                      <InputGroup className="bg-neutral-50">
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
                            definition (e.g. 0.5 * t).
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
          <AccordionItem value="supported-math-functions">
            <AccordionTrigger className="text-muted-foreground">
              <div className="flex items-center gap-x-2 font-normal">
                <VariableIcon className="size-4" />
                Supported Math Functions
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableCaption>
                  A list of supported math functions for custom wind velocity
                  definitions.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Function</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(SUPPORTED_MATH_FUNCTIONS).map(
                    ([category, functions]) =>
                      functions.map((fn) => (
                        <TableRow key={`${category}-${fn.display}`}>
                          <TableCell className="text-muted-foreground text-xs">
                            {category}
                          </TableCell>
                          <TableCell>
                            <code>{fn.display}</code>
                          </TableCell>
                        </TableRow>
                      )),
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="supported-math-constants">
            <AccordionTrigger className="text-muted-foreground">
              <div className="flex items-center gap-x-2 font-normal">
                <PiIcon className="size-4" />
                Supported Math Constants
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableCaption>
                  A list of supported math constants for custom wind velocity
                  definitions.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Constant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(SUPPORTED_MATH_CONSTANTS).flatMap(
                    ([category, consts]) =>
                      consts.map((c) => (
                        <TableRow key={`const-${c}`}>
                          <TableCell className="text-muted-foreground text-xs">
                            {category}
                          </TableCell>
                          <TableCell>
                            <code>{c}</code>
                          </TableCell>
                        </TableRow>
                      )),
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    );
  },
});

export { SimulationConfigFormWindVelocityFunctionInput };
