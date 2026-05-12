import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import React, { useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
      })),
    );

const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export { QueryProvider, type QueryProviderProps };
