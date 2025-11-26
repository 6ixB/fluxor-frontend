import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { DroneIcon } from "lucide-react";
import { SimulationConfigForm } from "./body/simulation-config-sidebar/simulation-config-form";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const AppSidebar: React.FC = () => {
  return (
    <Sidebar id={TOUR_STEP_IDS.SIMULATION_CONFIG}>
      <SidebarHeader className="border-b px-6 py-3">
        <div className="flex items-center gap-x-2 select-none">
          <DroneIcon className="size-6" />
          <span className="text-xl font-semibold">Fluxor</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SimulationConfigForm />
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };
