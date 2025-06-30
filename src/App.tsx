import { Toaster } from ".././src/components/ui/toaster";
import { Toaster as Sonner } from ".././src/components/ui/sonner";
import { TooltipProvider } from ".././src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import CustomerVerification from "./pages/CustomerVerification";
import AdminPanel from "./pages/AdminPanel";
import Contact from "./pages/Contact";
import ExtensionDemo from "./pages/ExtensionDemo";
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
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
          <Route path="/verify" element={<CustomerVerification />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/extension-demo" element={<ExtensionDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
