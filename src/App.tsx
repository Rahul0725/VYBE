import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BioPage from './pages/BioPage';
import PreviewPage from './pages/PreviewPage';
import OnboardingPage from './pages/OnboardingPage';
import ExplorePage from './pages/ExplorePage';
import { motion, AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-vybe-accent border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/preview/:token" element={<PreviewPage />} />
            <Route path="/:username" element={<BioPage />} />
          </Routes>
        </AnimatePresence>
      </Router>
      <Toaster theme="dark" position="bottom-center" toastOptions={{
        className: 'bg-vybe-darker border-white/10 text-white',
      }} />
    </AuthProvider>
  );
}
