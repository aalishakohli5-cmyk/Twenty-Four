import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { MotionProvider } from './context/MotionContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { OnboardingPage } from './pages/OnboardingPage';
import { TodayPage } from './pages/TodayPage';
import { TimelinePage } from './pages/TimelinePage';
import { FocusPage } from './pages/FocusPage';
import { WalletPage } from './pages/WalletPage';
import { StorePage } from './pages/StorePage';
import { InsightsPage } from './pages/InsightsPage';
import { DayReviewPage } from './pages/DayReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import './styles/public-legacy.css';

function AppRoutes() {
  const { state } = useApp();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              {state.onboardingComplete ? (
                <AppLayout />
              ) : (
                <Navigate to="/onboarding" replace />
              )}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="today" replace />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="review" element={<DayReviewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/today" element={<Navigate to="/app/today" replace />} />
        <Route path="/focus" element={<Navigate to="/app/focus" replace />} />
        <Route path="/wallet" element={<Navigate to="/app/wallet" replace />} />
        <Route path="/store" element={<Navigate to="/app/store" replace />} />
        <Route path="/report" element={<Navigate to="/app/insights" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <MotionProvider>
            <AppRoutes />
          </MotionProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
