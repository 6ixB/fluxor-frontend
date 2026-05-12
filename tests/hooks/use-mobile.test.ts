import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useIsMobile } from "@/hooks/use-mobile";

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
  const factory = (query: string) => {
    let mql = registry.get(query);
    if (!mql) {
      mql = new MockMediaQueryList(query, false);
      registry.set(query, mql);
    }
    return mql;
  };
  vi.stubGlobal("matchMedia", factory);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: factory,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useIsMobile", () => {
  const mobileQuery = "(max-width: 767px)";

  it("returns false when the viewport is wider than the mobile breakpoint", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true when the mobile media query matches", () => {
    registry.set(mobileQuery, new MockMediaQueryList(mobileQuery, true));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("updates when the viewport changes across the breakpoint", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    const mql = registry.get(mobileQuery)!;
    act(() => mql.trigger(true));
    expect(result.current).toBe(true);

    act(() => mql.trigger(false));
    expect(result.current).toBe(false);
  });

  it("removes the change listener on unmount", () => {
    const { unmount } = renderHook(() => useIsMobile());
    const mql = registry.get(mobileQuery)!;

    expect(mql.hasListeners()).toBe(true);
    unmount();
    expect(mql.hasListeners()).toBe(false);
  });
});
