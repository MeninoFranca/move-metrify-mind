import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import { NutritionProvider } from '@/contexts/NutritionContext';
import { CalendarProvider } from '@/contexts/CalendarContext';

// Páginas
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Progress from '@/pages/Progress';
import WorkoutGenerator from '@/pages/WorkoutGenerator';
import Nutrition from '@/pages/Nutrition';
import CalendarPage from '@/pages/Calendar';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <WorkoutProvider>
          <NutritionProvider>
            <CalendarProvider>
              <Router>
                <div className="App">
                  <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Rotas Protegidas */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/workouts" element={<ProtectedRoute><WorkoutGenerator /></ProtectedRoute>} />
                    <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                    
                    {/* Rota de Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </CalendarProvider>
          </NutritionProvider>
        </WorkoutProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
