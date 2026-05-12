import {
  HealthResponseEntitySchema,
  type HealthResponseEntity,
} from "@/types/health.type";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/health`;

async function fetchHealth(): Promise<HealthResponseEntity> {
  const response = await fetch(`${baseUrl}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to run simulation");
  }

  const data = await response.json();

  const validatedHealthResponse = HealthResponseEntitySchema.safeParse(data);

  if (!validatedHealthResponse.success) {
    throw new Error("Failed to validate simulation result");
  }

  return validatedHealthResponse.data;
}

export { fetchHealth };
