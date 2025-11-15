import { ThemeProvider } from "@/components/providers/theme-provider";
import { TourProvider } from "@/components/tour";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="fluxor-ui-theme">
      <TourProvider>{children}</TourProvider>
    </ThemeProvider>
  );
};

export { Providers };
