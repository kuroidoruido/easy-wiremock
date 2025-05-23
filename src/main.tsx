import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@picocss/pico/css/pico.min.css";
import { App } from "./App.tsx";
import { TanstackQueryProvider } from "./config/tanstack-query.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <App />
    </TanstackQueryProvider>
  </StrictMode>
);
