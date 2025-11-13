import { Providers } from "@/components/providers/providers";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return <Providers>{children}</Providers>;
};

export { AppLayout };
