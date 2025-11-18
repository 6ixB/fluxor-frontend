import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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

const SimulationConfigFormDroneSpeedInput = withForm({
  ...simulationConfigFormOpts,
  render: ({ form }) => {
    return (
      <form.Field
        name="droneSpeed"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Drone Speed</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value ?? 0))
                  }
                  aria-invalid={isInvalid}
                  placeholder="Enter a number e.g. 5.0 m/s"
                  autoComplete="off"
                  type="number"
                  step={0.1}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>meters per second</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  },
});

export { SimulationConfigFormDroneSpeedInput };
