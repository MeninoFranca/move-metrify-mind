import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WorkoutGenerator from './pages/WorkoutGenerator';
import Nutrition from './pages/Nutrition';
import Reminders from './pages/Reminders';
import Progress from './pages/Progress';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { NutritionProvider } from './contexts/NutritionContext';
import { ReminderProvider } from './contexts/ReminderContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { UserProvider } from './contexts/UserContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <Router>
            <CalendarProvider>
              <ProgressProvider>
                <ReminderProvider>
                  <NutritionProvider>
                    <WorkoutProvider>
                      <Routes>
                        {/* Páginas públicas */}
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

                        {/* Páginas protegidas */}
                        <Route path="/onboarding" element={
                          <ProtectedRoute>
                            <Onboarding />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/nutrition" element={
                          <ProtectedRoute>
                            <Nutrition />
                          </ProtectedRoute>
                        } />
                        <Route path="/workout-generator" element={
                          <ProtectedRoute>
                            <WorkoutGenerator />
                          </ProtectedRoute>
                        } />
                        <Route path="/progress" element={
                          <ProtectedRoute>
                            <Progress />
                          </ProtectedRoute>
                        } />
                        <Route path="/calendar" element={
                          <ProtectedRoute>
                            <Calendar />
                          </ProtectedRoute>
                        } />
                        <Route path="/reminders" element={
                          <ProtectedRoute>
                            <Reminders />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />

                        {/* Página 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </WorkoutProvider>
                  </NutritionProvider>
                </ReminderProvider>
              </ProgressProvider>
            </CalendarProvider>
          </Router>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
