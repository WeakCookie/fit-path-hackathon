import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrainingLog from "./pages/TrainingLog";
import TrainingHistory from "./pages/TrainingHistory";
import ResearchConfidence from "./pages/ResearchConfidence";
import KnowledgeBase from "./pages/KnowledgeBase";
import Recovery from "./pages/Recovery";
import Program from "./pages/Program";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training-log" element={<TrainingLog />} />
          <Route path="/training-history" element={<TrainingHistory />} />
          <Route path="/research-confidence" element={<ResearchConfidence />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/program" element={<Program />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
