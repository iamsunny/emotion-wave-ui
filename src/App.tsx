
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CheckIn from "./pages/CheckIn";
import Rewards from "./pages/Rewards";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component
import NotFound from "./pages/NotFound";
import NudgeReminder from "./components/NudgeReminder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/events" element={<Events />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Add new Dashboard route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <NudgeReminder firstName="Buddy" />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
