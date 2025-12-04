import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Providers>
      <AppSidebar />
      {children}
      <Analytics />
      <SpeedInsights />
    </Providers>
  );
};

export { AppLayout };
