
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/layouts/AppLayout";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "@/pages/TransactionsPage";
import LiquidityPage from "@/pages/LiquidityPage";
import AgenciesPage from "@/pages/AgenciesPage";
import AgencyDetailPage from "@/pages/AgencyDetailPage";
import CustomersPage from "@/pages/CustomersPage";
import CustomerDetailPage from "@/pages/CustomerDetailPage";
import RatesPage from "@/pages/RatesPage";
import StatsPage from "@/pages/StatsPage";
import SettingsPage from "@/pages/SettingsPage";
import ImportPage from "@/pages/ImportPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import TestFeaturesPage from "@/pages/TestFeaturesPage";
import TestNewFeaturesPage from "@/pages/TestNewFeaturesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/transactions" element={<TransactionsPage />} />
                      <Route path="/liquidity" element={<LiquidityPage />} />
                      <Route path="/agencies" element={<AgenciesPage />} />
                      <Route path="/agencies/:id" element={<AgencyDetailPage />} />
                      <Route path="/customers" element={<CustomersPage />} />
                      <Route path="/customers/:id" element={<CustomerDetailPage />} />
                      <Route path="/rates" element={<RatesPage />} />
                      <Route path="/stats" element={<StatsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/import" element={<ImportPage />} />
                      <Route path="/test-features" element={<TestFeaturesPage />} />
                      <Route path="/test-new-features" element={<TestNewFeaturesPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
