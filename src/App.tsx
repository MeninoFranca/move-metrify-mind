import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import { NutritionProvider } from '@/contexts/NutritionContext';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { UserProvider } from '@/contexts/UserContext';

// Páginas
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Workouts from '@/pages/Workouts';
import ModernDashboard from '@/pages/ModernDashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Progress from '@/pages/Progress';
import Nutrition from '@/pages/Nutrition';
import CalendarPage from '@/pages/Calendar';
import Onboarding from '@/pages/Onboarding'; // <-- Importação da página de Onboarding
import Subscription from '@/pages/Subscription';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import SubscriptionCancel from '@/pages/SubscriptionCancel';
import AdminSubscription from '@/pages/AdminSubscription';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <WorkoutProvider>
          <NutritionProvider>
            <CalendarProvider>
              <UserProvider>
              <Router>
                <div className="App">
                  <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Rotas Protegidas */}
                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><ModernDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
                    <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                    <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                    <Route path="/subscription/success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />
                    <Route path="/subscription/cancel" element={<ProtectedRoute><SubscriptionCancel /></ProtectedRoute>} />
                    <Route path="/admin/subscription" element={<ProtectedRoute><AdminSubscription /></ProtectedRoute>} />
                    
                    {/* Rota de Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
              </UserProvider>
            </CalendarProvider>
          </NutritionProvider>
        </WorkoutProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;