import {
  WindVelFuncPreset,
  WindVelFuncPresetValues,
} from "@/types/simulation.type";

const defaults = {
  simulationConfig: {
    x0: 2.5,
    y0: 2.5,
    z0: 2.5,
    droneSpeed: 3.0,
    windVelFuncX:
      WindVelFuncPresetValues[WindVelFuncPreset.ExponentialSinusoid].toString(),
    windVelFuncY:
      WindVelFuncPresetValues[WindVelFuncPreset.Sinusoid].toString(),
    windVelFuncZ: WindVelFuncPresetValues[WindVelFuncPreset.Linear].toString(),
    timeStep: 0.001,
    steps: 2000,
  },
};

export { defaults };
