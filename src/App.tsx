
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import AgenciesPage from "./pages/AgenciesPage";
import LiquidityPage from "./pages/LiquidityPage";
import StatsPage from "./pages/StatsPage";
import ImportPage from "./pages/ImportPage";
import SettingsPage from "./pages/SettingsPage";
import RatesPage from "./pages/RatesPage";
import NotFound from "./pages/NotFound";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/customers/:id" element={<CustomerDetailPage />} />
                    <Route path="/agencies" element={
                      <ProtectedRoute requiredPermission="view_all_agencies">
                        <AgenciesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/liquidity" element={
                      <ProtectedRoute requiredPermission="manage_liquidity">
                        <LiquidityPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/stats" element={
                      <ProtectedRoute requiredPermission="view_reports">
                        <StatsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/import" element={
                      <ProtectedRoute requiredPermission="manage_system">
                        <ImportPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/rates" element={
                      <ProtectedRoute requiredPermission="manage_system">
                        <RatesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute requiredPermission="manage_system">
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
