import {
  SimulationResultEntitySchema,
  type SimulationConfigDto,
  type SimulationResultEntity,
} from "@/types/simulation.type";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/simulations`;

async function runSimulation(
  simulationConfigDto: SimulationConfigDto,
): Promise<SimulationResultEntity> {
  const {
    x0,
    y0,
    z0,
    droneSpeed,
    steps,
    timeStep,
    windVelFuncX,
    windVelFuncY,
    windVelFuncZ,
  } = simulationConfigDto;

  const simulationConfig = {
    x0: x0,
    y0: y0,
    z0: z0,
    windVelFuncX,
    windVelFuncY,
    windVelFuncZ,
    droneSpeed: droneSpeed,
    steps: steps,
    timeStep: timeStep,
  };

  const response = await fetch(`${baseUrl}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(simulationConfig),
  });

  if (!response.ok) {
    throw new Error("Failed to run simulation");
  }

  const data = await response.json();

  const validatedSimulationResult =
    await SimulationResultEntitySchema.safeParseAsync(data);

  if (!validatedSimulationResult.success) {
    throw new Error("Failed to validate simulation result");
  }

  return validatedSimulationResult.data;
}

export { runSimulation };
