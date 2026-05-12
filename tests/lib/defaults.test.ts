import { describe, it, expect } from "vitest";

import { defaults } from "@/lib/defaults";
import {
  SimulationConfigDtoSchema,
  WindVelFuncPreset,
  WindVelFuncPresetValues,
} from "@/types/simulation.type";

describe("defaults.simulationConfig", () => {
  const config = defaults.simulationConfig;

  it("provides numeric starting positions and motion parameters", () => {
    expect(config.x0).toBe(2.5);
    expect(config.y0).toBe(2.5);
    expect(config.z0).toBe(2.5);
    expect(config.droneSpeed).toBe(3.0);
    expect(config.timeStep).toBe(0.001);
    expect(config.steps).toBe(2500);
  });

  it("uses the expected wind velocity function preset per axis", () => {
    expect(config.windVelFuncX).toBe(
      WindVelFuncPresetValues[WindVelFuncPreset.ExponentialSinusoid],
    );
    expect(config.windVelFuncY).toBe(
      WindVelFuncPresetValues[WindVelFuncPreset.Sinusoid],
    );
    expect(config.windVelFuncZ).toBe(
      WindVelFuncPresetValues[WindVelFuncPreset.Linear],
    );
  });

  it("wind velocity function strings are non-empty", () => {
    expect(config.windVelFuncX.length).toBeGreaterThan(0);
    expect(config.windVelFuncY.length).toBeGreaterThan(0);
    expect(config.windVelFuncZ.length).toBeGreaterThan(0);
  });

  it("validates cleanly against the SimulationConfigDto schema", () => {
    const result = SimulationConfigDtoSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("falls within all documented numeric bounds", () => {
    expect(config.x0).toBeGreaterThanOrEqual(-20);
    expect(config.x0).toBeLessThanOrEqual(20);
    expect(config.y0).toBeGreaterThanOrEqual(0);
    expect(config.y0).toBeLessThanOrEqual(20);
    expect(config.z0).toBeGreaterThanOrEqual(-20);
    expect(config.z0).toBeLessThanOrEqual(20);
    expect(config.droneSpeed).toBeGreaterThanOrEqual(0);
    expect(config.droneSpeed).toBeLessThanOrEqual(20);
    expect(config.timeStep).toBeGreaterThanOrEqual(0.001);
    expect(config.timeStep).toBeLessThanOrEqual(0.5);
    expect(config.steps).toBeGreaterThanOrEqual(100);
    expect(config.steps).toBeLessThanOrEqual(10000);
    expect(Number.isInteger(config.steps)).toBe(true);
  });
});
