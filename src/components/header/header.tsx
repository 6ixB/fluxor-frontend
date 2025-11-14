import { DroneIcon } from "lucide-react";
import { AppInformationDialog } from "@/components/header/app-information-dialog";
import { ModeToggle } from "@/components/header/mode-toggle";

const Header: React.FC = () => {
  return (
    <header className="bg-background w-full border-b border-neutral-200 p-2 dark:border-neutral-800">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2 select-none">
            <DroneIcon className="size-6" />
            <span className="text-xl font-semibold">Fluxor</span>
          </div>
          <span className="text-muted-foreground text-sm font-normal">
            Delivery Drone Trajectory Simulation
          </span>
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <span className="text-muted-foreground mr-4 text-xs">
            Built by 6ixB
          </span>
          <AppInformationDialog />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export { Header };
