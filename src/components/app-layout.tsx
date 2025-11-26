import { Providers } from "@/components/providers/providers";
import { Analytics } from "@vercel/analytics/react";
import { AppSidebar } from "./app-sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Providers>
      <AppSidebar />
      {children}
      <Analytics />
    </Providers>
  );
};

export { AppLayout };
