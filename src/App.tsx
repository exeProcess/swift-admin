import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { AppLayout } from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AccessPage from "./pages/access/AccessPage";
import CustomersPage from "./pages/customers/CustomersPage";
import CardsPage from "./pages/cards/CardsPage";
import MobilePage from "./pages/mobile/MobilePage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import FraudPage from "./pages/fraud/FraudPage";
import SupportPage from "./pages/support/SupportPage";
import ConfigPage from "./pages/config/ConfigPage";
import "./App.css";

function ProtectedRoutes() {
  const { admin, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!admin) return <Navigate to="/login" replace />;
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"          element={<DashboardPage />} />
        <Route path="/access"    element={<AccessPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/cards"     element={<CardsPage />} />
        <Route path="/mobile"    element={<MobilePage />} />
        <Route path="/payments"  element={<PaymentsPage />} />
        <Route path="/fraud"     element={<FraudPage />} />
        <Route path="/support"   element={<SupportPage />} />
        <Route path="/config"    element={<ConfigPage />} />
      </Route>
    </Routes>
  );
}

function LoginRedirect() {
  const { admin } = useAuth();
  if (admin) return <Navigate to="/" replace />;
  return <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/*"     element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
