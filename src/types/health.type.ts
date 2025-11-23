import { z } from "zod";

const HealthResponseEntitySchema = z.object({
  status: z.literal("ok"),
  timestamp: z.iso.datetime(),
});

type HealthResponseEntity = z.infer<typeof HealthResponseEntitySchema>;

export { HealthResponseEntitySchema, type HealthResponseEntity };
