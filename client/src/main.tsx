import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider, queryClient } from "./lib/queryClient";
import { JobProvider } from "./contexts/JobContext";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <JobProvider>
      <App />
      <Toaster />
    </JobProvider>
  </QueryClientProvider>
);