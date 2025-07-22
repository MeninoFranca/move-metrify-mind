import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Progress from '@/pages/Progress';
import WorkoutGenerator from '@/pages/WorkoutGenerator';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <WorkoutProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                />
                <Route 
                  path="/profile" 
                  element={<ProtectedRoute><Profile /></ProtectedRoute>} 
                />
                <Route 
                  path="/settings" 
                  element={<ProtectedRoute><Settings /></ProtectedRoute>} 
                />
                <Route 
                  path="/progress" 
                  element={<ProtectedRoute><Progress /></ProtectedRoute>} 
                />
                 <Route 
                  path="/workouts" 
                  element={<ProtectedRoute><WorkoutGenerator /></ProtectedRoute>} 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </WorkoutProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
