import { TourContext } from "@/components/tour";
import { useContext } from "react";

const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};

export { useTour };
