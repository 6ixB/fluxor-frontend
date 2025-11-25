import { z } from "zod";

const SimulationConfigDtoSchema = z.object({
  x0: z
    .number()
    .min(-20.0, "X start must be at least -20.0 m")
    .max(20.0, "X start must be at most 20.0 m"),
  y0: z
    .number()
    .min(0.0, "Y start must be at least 0.0 m")
    .max(20.0, "Y start must be at most 20.0 m"),
  z0: z
    .number()
    .min(-20.0, "Z start must be at least -20.0 m")
    .max(20.0, "Z start must be at most 20.0 m"),
  droneSpeed: z
    .number()
    .min(0.0, "Drone speed must be at least 0.0 m/s.")
    .max(20.0, "Drone speed must be at most 20.0 m/s."),
  windVelFuncX: z.string().nonempty(),
  windVelFuncY: z.string().nonempty(),
  windVelFuncZ: z.string().nonempty(),
  timeStep: z
    .number()
    .min(0.001, "Time step must be at least 0.001 s.")
    .max(0.5, "Time step must be at most 0.5 s."),
  steps: z
    .int()
    .min(100, "Steps must be at least 100 steps.")
    .max(10000, "Steps must be at most 10000 steps."),
});

const SimulationResultEntitySchema = z.object({
  ts: z.array(z.number()),
  xs: z.array(z.number()),
  ys: z.array(z.number()),
  zs: z.array(z.number()),
  bxs: z.array(z.number()),
  bys: z.array(z.number()),
  bzs: z.array(z.number()),
  bs: z.array(z.number()),
});

type FunctionPreset = {
  x: WindVelFuncPreset;
  y: WindVelFuncPreset;
  z: WindVelFuncPreset;
};

const WindVelFuncPreset = {
  Custom: "custom",
  Linear: "linear",
  Sinusoid: "sinusoid",
  ExponentialSinusoid: "exponential-sinusoid",
} as const;

type WindVelFuncPreset =
  (typeof WindVelFuncPreset)[keyof typeof WindVelFuncPreset];

const WindVelFuncPresetValues: Record<WindVelFuncPreset, string> = {
  [WindVelFuncPreset.Custom]:
    "0.5 * t * cos(0.25 * pi * t + 0.125) * e**(0.1 * t) + 0.1",
  [WindVelFuncPreset.Linear]: "0.5 * t + 0.1",
  [WindVelFuncPreset.Sinusoid]: "0.5 * t * sin(0.25 * pi * t + 0.125) + 0.1",
  [WindVelFuncPreset.ExponentialSinusoid]:
    "0.5 * t * sin(0.25 * pi * t + 0.125) * e**(0.1 * t) + 0.1",
};

const ReverseWindVelFuncPresetValues = Object.fromEntries(
  Object.entries(WindVelFuncPresetValues).map(([key, val]) => [val, key]),
) as Record<string, WindVelFuncPreset>;

type SimulationConfigDto = z.infer<typeof SimulationConfigDtoSchema>;
type SimulationResultEntity = z.infer<typeof SimulationResultEntitySchema>;

const AnimationStatus = {
  Paused: "paused",
  Playing: "playing",
  Ended: "ended",
} as const;

type AnimationStatusType =
  (typeof AnimationStatus)[keyof typeof AnimationStatus];

export {
  SimulationConfigDtoSchema,
  SimulationResultEntitySchema,
  type SimulationConfigDto,
  type SimulationResultEntity,
  type FunctionPreset,
  WindVelFuncPreset,
  WindVelFuncPresetValues,
  ReverseWindVelFuncPresetValues,
  AnimationStatus,
  type AnimationStatusType,
};
