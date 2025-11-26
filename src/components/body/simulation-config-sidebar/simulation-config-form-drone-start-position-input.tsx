import { Field, FieldError } from "@/components/ui/field";
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

const SimulationConfigFormDroneStartPositionInput = withForm({
  ...simulationConfigFormOpts,
  render: ({ form }) => {
    return (
      <div className="flex flex-col gap-y-3">
        <h1 className="text-sm font-medium">
          Drone Start Position&nbsp;
          <span className="text-muted-foreground text-sm font-medium">
            (meters)
          </span>
        </h1>
        <div className="grid grid-cols-3 gap-x-4">
          <form.Field
            name="x0"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>X</InputGroupText>
                    </InputGroupAddon>
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
                      step={1}
                    />
                  </InputGroup>
                </Field>
              );
            }}
          />
          <form.Field
            name="y0"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>Y</InputGroupText>
                    </InputGroupAddon>
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
                      step={1}
                    />
                  </InputGroup>
                </Field>
              );
            }}
          />
          <form.Field
            name="z0"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>Z</InputGroupText>
                    </InputGroupAddon>
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
                      step={1}
                    />
                  </InputGroup>
                </Field>
              );
            }}
          />
        </div>
        <form.Subscribe
          selector={(state) => ({
            x0: state.fieldMeta.x0,
            y0: state.fieldMeta.y0,
            z0: state.fieldMeta.z0,
          })}
        >
          {({ x0, y0, z0 }) => {
            const fields = [
              ["x0", x0] as const,
              ["y0", y0] as const,
              ["z0", z0] as const,
            ];

            return (
              <>
                {fields.map(([name, meta]) => {
                  if (!meta) return null;
                  const isInvalid = meta.isTouched && !meta.isValid;
                  if (!isInvalid) return null;

                  return <FieldError key={name} errors={meta.errors} />;
                })}
              </>
            );
          }}
        </form.Subscribe>
        <p className="text-muted-foreground text-sm leading-normal font-normal">
          Set the initial drone position, as the delivery drone will attempt to
          move to the origin point.
        </p>
      </div>
    );
  },
});

export { SimulationConfigFormDroneStartPositionInput };
