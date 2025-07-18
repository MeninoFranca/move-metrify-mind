import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <CalendarProvider>
            <ProgressProvider>
              <ReminderProvider>
                <NutritionProvider>
                  <WorkoutProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/workouts" element={<WorkoutGenerator />} />
                      <Route path="/nutrition" element={<Nutrition />} />
                      <Route path="/reminders" element={<Reminders />} />
                      <Route path="/progress" element={<Progress />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </WorkoutProvider>
                </NutritionProvider>
              </ReminderProvider>
            </ProgressProvider>
          </CalendarProvider>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
