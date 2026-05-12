import { describe, it, expect } from "vitest";

import { HealthResponseEntitySchema } from "@/types/health.type";

describe("HealthResponseEntitySchema", () => {
  it("accepts a valid health response", () => {
    const result = HealthResponseEntitySchema.safeParse({
      status: "ok",
      timestamp: "2026-05-12T12:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a UTC ISO datetime with milliseconds", () => {
    const result = HealthResponseEntitySchema.safeParse({
      status: "ok",
      timestamp: "2026-05-12T12:00:00.123Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a status that is not the literal 'ok'", () => {
    const result = HealthResponseEntitySchema.safeParse({
      status: "degraded",
      timestamp: "2026-05-12T12:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-ISO timestamp string", () => {
    const result = HealthResponseEntitySchema.safeParse({
      status: "ok",
      timestamp: "May 12, 2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when timestamp is missing", () => {
    const result = HealthResponseEntitySchema.safeParse({ status: "ok" });
    expect(result.success).toBe(false);
  });

  it("rejects when status is missing", () => {
    const result = HealthResponseEntitySchema.safeParse({
      timestamp: "2026-05-12T12:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when timestamp is not a string", () => {
    const result = HealthResponseEntitySchema.safeParse({
      status: "ok",
      timestamp: 1234567890,
    });
    expect(result.success).toBe(false);
  });
});
