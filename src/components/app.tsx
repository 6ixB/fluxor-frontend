import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header/header";
import { Body } from "@/components/body/body";

const App: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex h-dvh w-full flex-col bg-neutral-100 dark:bg-neutral-900">
        <Header />
        <Body />
      </div>
      <Toaster
        richColors
        closeButton
        position="top-right"
        className="pointer-events-auto"
      />
    </AppLayout>
  );
};

export { App };
