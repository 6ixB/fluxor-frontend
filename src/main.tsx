import { AppBrowserRouter } from "@/components/app-browser-router";
import { AppGlobalError } from "@/components/app-global-error";
import "@/index.css";
import { printSplashScreen } from "@/lib/utils";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

printSplashScreen();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<AppGlobalError />}>
      <AppBrowserRouter />
    </ErrorBoundary>
  </StrictMode>,
);
