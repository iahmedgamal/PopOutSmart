import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/index.ts";

// Correct usage of createRoot and rendering with StrictMode
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);