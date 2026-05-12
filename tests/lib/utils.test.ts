import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { create } from "zustand";

import { cn, createSelectors, printSplashScreen } from "@/lib/utils";

describe("cn", () => {
  it("merges plain class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values from clsx inputs", () => {
    expect(cn("foo", false, null, undefined, "bar", 0 && "skip")).toBe(
      "foo bar",
    );
  });

  it("supports conditional object and array syntax", () => {
    expect(cn(["foo", { bar: true, baz: false }], "qux")).toBe("foo bar qux");
  });

  it("dedupes conflicting tailwind utility classes via twMerge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("preserves non-conflicting tailwind utilities", () => {
    expect(cn("p-2", "m-4", "flex")).toBe("p-2 m-4 flex");
  });

  it("returns an empty string when given no truthy inputs", () => {
    expect(cn()).toBe("");
    expect(cn(undefined, false, null)).toBe("");
  });
});

describe("createSelectors", () => {
  it("attaches a `use` object with a selector function for every state key", () => {
    const useBase = create<{ count: number; name: string }>(() => ({
      count: 1,
      name: "fluxor",
    }));

    const useStore = createSelectors(useBase);

    expect(useStore.use).toBeDefined();
    expect(typeof useStore.use.count).toBe("function");
    expect(typeof useStore.use.name).toBe("function");
  });

  it("selectors return the corresponding state value when called from a component", () => {
    const useBase = create<{ count: number; flag: boolean }>(() => ({
      count: 42,
      flag: true,
    }));

    const useStore = createSelectors(useBase);

    const { result: count } = renderHook(() => useStore.use.count());
    const { result: flag } = renderHook(() => useStore.use.flag());

    expect(count.current).toBe(42);
    expect(flag.current).toBe(true);
  });

  it("reflects state updates after setState is called", () => {
    const useBase = create<{ count: number }>(() => ({ count: 0 }));
    const useStore = createSelectors(useBase);

    const { result } = renderHook(() => useStore.use.count());
    expect(result.current).toBe(0);

    act(() => {
      useBase.setState({ count: 7 });
    });
    expect(result.current).toBe(7);
  });

  it("returns the same store reference (mutates in place)", () => {
    const useBase = create<{ a: number }>(() => ({ a: 1 }));
    const result = createSelectors(useBase);

    expect(result).toBe(useBase);
  });

  it("does not create selectors for keys added after initialization", () => {
    const useBase = create<{ a: number }>(() => ({ a: 1 }));
    const useStore = createSelectors(useBase);

    expect(Object.keys(useStore.use)).toEqual(["a"]);
  });
});

describe("printSplashScreen", () => {
  it("logs the banner to the console with monospace styling", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    printSplashScreen();

    expect(spy).toHaveBeenCalledTimes(1);
    const [bannerArg, styleArg] = spy.mock.calls[0];

    expect(typeof bannerArg).toBe("string");
    expect(bannerArg).toContain("Greetings!");
    expect(bannerArg).toContain("https://github.com/6ixB");
    expect(bannerArg.startsWith("%c")).toBe(true);

    expect(typeof styleArg).toBe("string");
    expect(styleArg).toContain("font-family: monospace");
    expect(styleArg).toContain("white-space: pre");
  });
});
