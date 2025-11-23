import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TourProvider } from "@/components/tour";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="fluxor-ui-theme">
        <TourProvider>{children}</TourProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export { Providers };
