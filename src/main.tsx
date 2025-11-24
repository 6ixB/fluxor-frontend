import { StrictMode } from "react";
import { printSplashScreen } from "@/lib/utils";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { AppGlobalError } from "@/components/app-global-error";
import { AppBrowserRouter } from "@/components/app-browser-router";
import "@/index.css";

printSplashScreen();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<AppGlobalError />}>
      <AppBrowserRouter />
    </ErrorBoundary>
  </StrictMode>,
);
