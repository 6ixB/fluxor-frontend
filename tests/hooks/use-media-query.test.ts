import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useMediaQuery } from "@/hooks/use-media-query";

type Listener = (event: { matches: boolean }) => void;

class MockMediaQueryList {
  matches: boolean;
  media: string;
  private listeners = new Set<Listener>();

  constructor(media: string, matches: boolean) {
    this.media = media;
    this.matches = matches;
  }

  addEventListener(_type: "change", listener: Listener) {
    this.listeners.add(listener);
  }

  removeEventListener(_type: "change", listener: Listener) {
    this.listeners.delete(listener);
  }

  trigger(matches: boolean) {
    this.matches = matches;
    for (const l of this.listeners) {
      l({ matches });
    }
  }

  hasListeners() {
    return this.listeners.size > 0;
  }
}

const registry = new Map<string, MockMediaQueryList>();

beforeEach(() => {
  registry.clear();
  vi.stubGlobal("matchMedia", (query: string) => {
    let mql = registry.get(query);
    if (!mql) {
      mql = new MockMediaQueryList(query, false);
      registry.set(query, mql);
    }
    return mql;
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: globalThis.matchMedia,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("returns the initial match state of the query", () => {
    registry.set(
      "(min-width: 1024px)",
      new MockMediaQueryList("(min-width: 1024px)", true),
    );

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when the media query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 9999px)"));
    expect(result.current).toBe(false);
  });

  it("updates when the underlying media query changes", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 800px)"));
    expect(result.current).toBe(false);

    const mql = registry.get("(min-width: 800px)")!;
    act(() => mql.trigger(true));
    expect(result.current).toBe(true);

    act(() => mql.trigger(false));
    expect(result.current).toBe(false);
  });

  it("removes its listener on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 600px)"));
    const mql = registry.get("(min-width: 600px)")!;

    expect(mql.hasListeners()).toBe(true);
    unmount();
    expect(mql.hasListeners()).toBe(false);
  });

  it("re-subscribes when the query changes", () => {
    const { rerender } = renderHook(({ q }) => useMediaQuery(q), {
      initialProps: { q: "(min-width: 500px)" },
    });
    const first = registry.get("(min-width: 500px)")!;
    expect(first.hasListeners()).toBe(true);

    rerender({ q: "(min-width: 1200px)" });
    const second = registry.get("(min-width: 1200px)")!;
    expect(first.hasListeners()).toBe(false);
    expect(second.hasListeners()).toBe(true);
  });
});
