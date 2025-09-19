// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResultPage from "./pages/ResultPage";
import SurveyForm from "./pages/SurveyForm";
import { LoaderProvider } from "./components/LoaderContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LoaderProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/result/:token" element={<ResultPage />} />
            <Route path="/survey" element={<SurveyForm />} />
            <Route path="/learn-more" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LoaderProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;