import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DroneIcon } from "lucide-react";
import { SimulationConfigForm } from "@/components/body/simulation-config-sidebar/simulation-config-form";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const AppSidebar: React.FC = () => {
  return (
    <Sidebar id={TOUR_STEP_IDS.SIMULATION_CONFIG}>
      <SidebarHeader className="bg-background border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 select-none">
            <DroneIcon className="size-[1.2rem]" />
            <span className="text-lg font-semibold">Fluxor</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SimulationConfigForm />
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };
