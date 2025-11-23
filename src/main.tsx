import { StrictMode } from "react";
import { printSplashScreen } from "@/lib/utils";
import { createRoot } from "react-dom/client";
import { AppBrowserRouter } from "@/components/app-browser-router";
import "@/index.css";

printSplashScreen();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppBrowserRouter />
  </StrictMode>,
);
