import { DroneIcon } from "lucide-react";
import { ServerStatus } from "@/components/header/server-status";
import { InformationDialog } from "@/components/header/information-dialog";
import { ThemeModeToggle } from "@/components/header/theme-mode-toggle";

const Header: React.FC = () => {
  return (
    <header className="bg-background w-full border-b border-neutral-200 p-2 dark:border-neutral-800">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2 select-none">
            <DroneIcon className="size-6" />
            <span className="text-xl font-semibold">Fluxor</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <ServerStatus />
          <InformationDialog />
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
};

export { Header };
