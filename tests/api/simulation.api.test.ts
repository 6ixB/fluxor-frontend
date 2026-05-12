import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
} from "vitest";

import { defaults } from "@/lib/defaults";

beforeAll(() => {
  vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test");
});

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const validResultPayload = {
  ts: [0, 0.1],
  xs: [0, 1],
  ys: [0, 1],
  zs: [0, 1],
  bxs: [0, 0.1],
  bys: [0, 0.1],
  bzs: [0, 0.1],
  bs: [0, 0.1],
};

function mockFetch(impl: typeof fetch) {
  vi.stubGlobal("fetch", vi.fn(impl));
  return globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
}

describe("runSimulation", () => {
  it("POSTs the config as JSON to /simulations/run and returns the parsed result", async () => {
    const fetchMock = mockFetch(
      async () =>
        new Response(JSON.stringify(validResultPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );

    const { runSimulation } = await import("@/api/simulation.api");
    const result = await runSimulation(defaults.simulationConfig);

    expect(result).toEqual(validResultPayload);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/simulations/run");
    expect(options.method).toBe("POST");
    expect(
      (options.headers as Record<string, string>)["Content-Type"],
    ).toBe("application/json");

    const body = JSON.parse(options.body as string);
    expect(body).toEqual({
      x0: defaults.simulationConfig.x0,
      y0: defaults.simulationConfig.y0,
      z0: defaults.simulationConfig.z0,
      windVelFuncX: defaults.simulationConfig.windVelFuncX,
      windVelFuncY: defaults.simulationConfig.windVelFuncY,
      windVelFuncZ: defaults.simulationConfig.windVelFuncZ,
      droneSpeed: defaults.simulationConfig.droneSpeed,
      steps: defaults.simulationConfig.steps,
      timeStep: defaults.simulationConfig.timeStep,
    });
  });

  it("throws an error containing the server-supplied detail when the response is not ok", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ detail: "invalid wind function" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
    );

    const { runSimulation } = await import("@/api/simulation.api");

    await expect(runSimulation(defaults.simulationConfig)).rejects.toThrow(
      "Failed to run simulation (invalid wind function)",
    );
  });

  it("throws a validation error when the server returns a payload that fails schema validation", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ ts: [0], xs: "not-an-array" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );

    const { runSimulation } = await import("@/api/simulation.api");

    await expect(runSimulation(defaults.simulationConfig)).rejects.toThrow(
      "Failed to validate simulation result",
    );
  });

  it("propagates network failures from fetch", async () => {
    mockFetch(async () => {
      throw new TypeError("network down");
    });

    const { runSimulation } = await import("@/api/simulation.api");

    await expect(runSimulation(defaults.simulationConfig)).rejects.toThrow(
      "network down",
    );
  });
});
