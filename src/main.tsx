import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { RouteProgress } from "./components/RouteProgress";
import { LocaleProvider } from "./lib/i18n";
import { initTheme } from "./lib/theme";
import "./styles.css";

initTheme();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 120, damping: 24 }}>
      <LocaleProvider>
        <BrowserRouter>
          <RouteProgress />
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </MotionConfig>
  </StrictMode>
);
