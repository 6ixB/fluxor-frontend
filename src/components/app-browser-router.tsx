import { BrowserRouter, Routes, Route } from "react-router";
import { App } from "@/components/app";
import { AppNotFound } from "@/components/app-not-found";

const AppBrowserRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/*" element={<AppNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export { AppBrowserRouter };
