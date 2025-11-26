import { InformationDialog } from "@/components/header/information-dialog";
import { ThemeModeToggle } from "@/components/header/theme-mode-toggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DroneIcon } from "lucide-react";

const Header: React.FC = () => {
  const { open } = useSidebar();

  return (
    <header className="bg-background w-full border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger />
          {!open && (
            <div className="flex items-center gap-x-2 select-none">
              <DroneIcon className="size-[1.2rem]" />
              <span className="text-lg font-semibold">Fluxor</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <InformationDialog />
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
};

export { Header };
