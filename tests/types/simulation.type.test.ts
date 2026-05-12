import { describe, it, expect } from "vitest";

import {
  AnimationStatus,
  ReverseWindVelFuncPresetValues,
  SimulationConfigDtoSchema,
  SimulationResultEntitySchema,
  WindVelFuncPreset,
  WindVelFuncPresetValues,
} from "@/types/simulation.type";

const validConfig = {
  x0: 0,
  y0: 0,
  z0: 0,
  droneSpeed: 1,
  windVelFuncX: "1",
  windVelFuncY: "1",
  windVelFuncZ: "1",
  timeStep: 0.01,
  steps: 100,
};

describe("SimulationConfigDtoSchema", () => {
  it("accepts a fully valid config", () => {
    const result = SimulationConfigDtoSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  describe("x0", () => {
    it("accepts the minimum and maximum boundary values", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, x0: -20 })
          .success,
      ).toBe(true);
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, x0: 20 }).success,
      ).toBe(true);
    });

    it("rejects values just outside the boundaries", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, x0: -20.0001 })
          .success,
      ).toBe(false);
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, x0: 20.0001 })
          .success,
      ).toBe(false);
    });
  });

  describe("y0", () => {
    it("rejects negative values (y0 must be >= 0)", () => {
      const result = SimulationConfigDtoSchema.safeParse({
        ...validConfig,
        y0: -0.0001,
      });
      expect(result.success).toBe(false);
    });

    it("accepts 0 and 20 at the boundaries", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, y0: 0 }).success,
      ).toBe(true);
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, y0: 20 }).success,
      ).toBe(true);
    });
  });

  describe("droneSpeed", () => {
    it("rejects negative speed", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({
          ...validConfig,
          droneSpeed: -1,
        }).success,
      ).toBe(false);
    });

    it("rejects speeds above 20 m/s", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({
          ...validConfig,
          droneSpeed: 20.0001,
        }).success,
      ).toBe(false);
    });
  });

  describe("wind velocity function strings", () => {
    it("rejects empty wind velocity function strings", () => {
      const fields = ["windVelFuncX", "windVelFuncY", "windVelFuncZ"] as const;
      for (const field of fields) {
        const result = SimulationConfigDtoSchema.safeParse({
          ...validConfig,
          [field]: "",
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe("timeStep", () => {
    it("rejects values below 0.001", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({
          ...validConfig,
          timeStep: 0.0009,
        }).success,
      ).toBe(false);
    });

    it("rejects values above 0.5", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({
          ...validConfig,
          timeStep: 0.51,
        }).success,
      ).toBe(false);
    });

    it("accepts boundary values 0.001 and 0.5", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({
          ...validConfig,
          timeStep: 0.001,
        }).success,
      ).toBe(true);
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, timeStep: 0.5 })
          .success,
      ).toBe(true);
    });
  });

  describe("steps", () => {
    it("rejects non-integer steps", () => {
      const result = SimulationConfigDtoSchema.safeParse({
        ...validConfig,
        steps: 100.5,
      });
      expect(result.success).toBe(false);
    });

    it("rejects values below 100 or above 10000", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, steps: 99 })
          .success,
      ).toBe(false);
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, steps: 10001 })
          .success,
      ).toBe(false);
    });

    it("accepts boundary integer values", () => {
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, steps: 100 })
          .success,
      ).toBe(true);
      expect(
        SimulationConfigDtoSchema.safeParse({ ...validConfig, steps: 10000 })
          .success,
      ).toBe(true);
    });
  });

  it("rejects missing required fields", () => {
    const { x0: _x0, ...partial } = validConfig;
    void _x0;
    const result = SimulationConfigDtoSchema.safeParse(partial);
    expect(result.success).toBe(false);
  });

  it("rejects wrong field types", () => {
    const result = SimulationConfigDtoSchema.safeParse({
      ...validConfig,
      x0: "not a number",
    });
    expect(result.success).toBe(false);
  });
});

describe("SimulationResultEntitySchema", () => {
  const validResult = {
    ts: [0, 0.1, 0.2],
    xs: [0, 1, 2],
    ys: [0, 1, 2],
    zs: [0, 1, 2],
    bxs: [0, 0.1, 0.2],
    bys: [0, 0.1, 0.2],
    bzs: [0, 0.1, 0.2],
    bs: [0, 0.1, 0.2],
  };

  it("accepts a complete result entity", () => {
    expect(SimulationResultEntitySchema.safeParse(validResult).success).toBe(
      true,
    );
  });

  it("accepts empty arrays for all fields", () => {
    const empty = {
      ts: [],
      xs: [],
      ys: [],
      zs: [],
      bxs: [],
      bys: [],
      bzs: [],
      bs: [],
    };
    expect(SimulationResultEntitySchema.safeParse(empty).success).toBe(true);
  });

  it("rejects when a required array is missing", () => {
    const { bs: _bs, ...partial } = validResult;
    void _bs;
    expect(SimulationResultEntitySchema.safeParse(partial).success).toBe(false);
  });

  it("rejects when array contains non-number entries", () => {
    expect(
      SimulationResultEntitySchema.safeParse({
        ...validResult,
        ts: [0, "1", 2],
      }).success,
    ).toBe(false);
  });
});

describe("WindVelFuncPreset", () => {
  it("exposes the expected preset identifiers", () => {
    expect(WindVelFuncPreset).toEqual({
      Custom: "custom",
      Linear: "linear",
      Sinusoid: "sinusoid",
      ExponentialSinusoid: "exponential-sinusoid",
    });
  });

  it("provides a non-empty expression string for each preset", () => {
    for (const preset of Object.values(WindVelFuncPreset)) {
      const expr = WindVelFuncPresetValues[preset];
      expect(typeof expr).toBe("string");
      expect(expr.length).toBeGreaterThan(0);
    }
  });

  it("preset expressions are pairwise unique", () => {
    const expressions = Object.values(WindVelFuncPresetValues);
    const unique = new Set(expressions);
    expect(unique.size).toBe(expressions.length);
  });
});

describe("ReverseWindVelFuncPresetValues", () => {
  it("maps expression strings back to their preset key", () => {
    for (const [preset, expression] of Object.entries(
      WindVelFuncPresetValues,
    )) {
      expect(ReverseWindVelFuncPresetValues[expression]).toBe(preset);
    }
  });

  it("returns undefined for an unknown expression", () => {
    expect(ReverseWindVelFuncPresetValues["not-a-real-expression"]).toBe(
      undefined,
    );
  });
});

describe("AnimationStatus", () => {
  it("contains the three expected animation states", () => {
    expect(AnimationStatus).toEqual({
      Paused: "paused",
      Playing: "playing",
      Ended: "ended",
    });
  });
});
