import { ThemeProvider } from "@/components/providers/theme-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="fluxor-ui-theme">
      {children}
    </ThemeProvider>
  );
};

export { Providers };
