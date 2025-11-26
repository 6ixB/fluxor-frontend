import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  simulationConfigFormOpts,
  withForm,
} from "@/hooks/use-simulation-config-form";

const SimulationConfigFormTimeStepInput = withForm({
  ...simulationConfigFormOpts,
  render: ({ form }) => {
    return (
      <form.Field
        name="timeStep"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Time Step</FieldLabel>
              <InputGroup className="bg-neutral-50">
                <InputGroupInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value ?? 0))
                  }
                  aria-invalid={isInvalid}
                  placeholder="Enter a number e.g. 0.001 s"
                  autoComplete="off"
                  type="number"
                  step={1}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>seconds</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                The time step determines how much simulation time passes between
                each RK4 update. Smaller values improve accuracy but increase
                computation time.
              </FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  },
});

export { SimulationConfigFormTimeStepInput };
