import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppBrowserRouter } from "@/components/app-browser-router";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppBrowserRouter />
  </StrictMode>,
);
