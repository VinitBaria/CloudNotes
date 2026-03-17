import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { AcademicOnboarding } from "@/components/AcademicOnboarding";
import MaintenancePage from "./pages/MaintenancePage";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import CollegeHub from "./pages/CollegeHub";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

import PaymentSuccess from "./pages/PaymentSuccess";
import MockCheckoutPage from "./pages/MockCheckoutPage";
import OnboardingPage from "./pages/OnboardingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

// Inner layout wrapper so we can use useLocation inside BrowserRouter
const AppLayout = () => {
  const location = useLocation();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const isAdminPage   = location.pathname.startsWith("/admin");
  // Allow login/register during maintenance so admin can sign in
  const isAuthPage    = ["/login", "/register"].includes(location.pathname);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [settingsLoaded,  setSettingsLoaded]  = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then(r => r.json())
      .then(data => {
        setMaintenanceMode(!!data.maintenanceMode);
        setSettingsLoaded(true);
      })
      .catch(() => setSettingsLoaded(true));
  }, []);

  // Wait for both auth and settings to load before deciding
  if (!settingsLoaded || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Maintenance bypass rules:
  //  ✅ Admins — always see the full site
  //  ✅ /admin  — admin panel always accessible
  //  ✅ /login, /register — so admin can sign in during maintenance
  //  ❌ Everyone else — sees MaintenancePage
  if (maintenanceMode && !isAdmin && !isAdminPage && !isAuthPage) {
    return <MaintenancePage />;
  }

  return (
    <div className="flex flex-col min-h-screen relative z-0 cursor-none">
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <AnnouncementBanner />}
      <AcademicOnboarding />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/college-hub" element={<CollegeHub />} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/mock-checkout" element={<ProtectedRoute><MockCheckoutPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster position="top-right" containerStyle={{ top: '80px' }} />
        <AuthProvider>
          <BrowserRouter>
            <SmoothScroll>
              <CustomCursor />
              <BackgroundAnimation />
              <AppLayout />
            </SmoothScroll>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
