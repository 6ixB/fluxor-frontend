import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TourProvider } from "@/components/tour";
import { SidebarProvider } from "@/components/ui/sidebar";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="fluxor-ui-theme">
        <TourProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </TourProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export { Providers };
