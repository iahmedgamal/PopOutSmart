import { StrictMode } from "react";
import { createRoot } from "react-dom/client";  // Ensure you're using React 18 or above
import WeatherApp from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/index.ts";

// Correct usage of createRoot and rendering with StrictMode
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WeatherApp />
    </QueryClientProvider>
  </StrictMode>
);
