import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

import { useTour } from "@/hooks/use-tour";
import { TourContext, type TourContextType } from "@/components/tour";

function makeContextValue(
  overrides: Partial<TourContextType> = {},
): TourContextType {
  return {
    currentStep: 0,
    totalSteps: 0,
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    endTour: vi.fn(),
    isActive: false,
    startTour: vi.fn(),
    setSteps: vi.fn(),
    steps: [],
    isTourCompleted: false,
    setIsTourCompleted: vi.fn(),
    ...overrides,
  };
}

describe("useTour", () => {
  it("throws a clear error when used outside a TourProvider", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useTour())).toThrow(
      "useTour must be used within a TourProvider",
    );

    errorSpy.mockRestore();
  });

  it("returns the context value when wrapped in TourContext.Provider", () => {
    const value = makeContextValue({
      currentStep: 2,
      totalSteps: 5,
      isActive: true,
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TourContext.Provider value={value}>{children}</TourContext.Provider>
    );

    const { result } = renderHook(() => useTour(), { wrapper });

    expect(result.current).toBe(value);
    expect(result.current.currentStep).toBe(2);
    expect(result.current.totalSteps).toBe(5);
    expect(result.current.isActive).toBe(true);
  });

  it("exposes the imperative API from the provider", () => {
    const value = makeContextValue();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TourContext.Provider value={value}>{children}</TourContext.Provider>
    );

    const { result } = renderHook(() => useTour(), { wrapper });

    result.current.nextStep();
    result.current.previousStep();
    result.current.startTour();
    result.current.endTour();
    result.current.setIsTourCompleted(true);
    result.current.setSteps([]);

    expect(value.nextStep).toHaveBeenCalledTimes(1);
    expect(value.previousStep).toHaveBeenCalledTimes(1);
    expect(value.startTour).toHaveBeenCalledTimes(1);
    expect(value.endTour).toHaveBeenCalledTimes(1);
    expect(value.setIsTourCompleted).toHaveBeenCalledWith(true);
    expect(value.setSteps).toHaveBeenCalledWith([]);
  });
});
