import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useThemeStore, useAuthStore } from "./store/useStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Deals from "./pages/Deals";

import ErrorBoundary from "./components/ErrorBoundary";

import MyBookings from "./pages/MyBookings";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null; // Or a spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Don't flash login if App is still checking auth on initial load
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-slate-900 text-sand' : 'bg-sand text-ink'}`}>
        <div className="h-8 w-8 border-4 border-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-slate-900 text-sand' : 'bg-sand text-ink'} transition-colors duration-300`}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1e293b' : '#fff',
            color: isDarkMode ? '#f8f4e6' : '#141414',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="/confirmation" element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/deals" element={<Deals />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
