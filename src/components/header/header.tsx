import { InformationDialog } from "@/components/header/information-dialog";
import { ThemeModeToggle } from "@/components/header/theme-mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header: React.FC = () => {
  return (
    <header className="bg-background w-full border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SidebarTrigger />
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
