import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
} from "vitest";

beforeAll(() => {
  vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test");
});

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetch(impl: typeof fetch) {
  vi.stubGlobal("fetch", vi.fn(impl));
  return globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
}

describe("fetchHealth", () => {
  it("GETs /health and returns the parsed body on success", async () => {
    const payload = { status: "ok", timestamp: "2026-05-12T12:00:00Z" };
    const fetchMock = mockFetch(
      async () =>
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );

    const { fetchHealth } = await import("@/api/health.api");
    const result = await fetchHealth();

    expect(result).toEqual(payload);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/health");
    expect(options.method).toBe("GET");
  });

  it("throws when the response is not ok", async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ message: "down" }), { status: 503 }),
    );

    const { fetchHealth } = await import("@/api/health.api");

    await expect(fetchHealth()).rejects.toThrow("Failed to run simulation");
  });

  it("throws a validation error when the payload fails schema validation", async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({ status: "degraded", timestamp: "not-iso" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
    );

    const { fetchHealth } = await import("@/api/health.api");

    await expect(fetchHealth()).rejects.toThrow(
      "Failed to validate simulation result",
    );
  });

  it("propagates network errors from fetch", async () => {
    mockFetch(async () => {
      throw new Error("connection refused");
    });

    const { fetchHealth } = await import("@/api/health.api");

    await expect(fetchHealth()).rejects.toThrow("connection refused");
  });
});
