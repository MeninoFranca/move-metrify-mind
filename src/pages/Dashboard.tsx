import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, Scale, Activity, Dumbbell, Pizza } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import HydrationCard from '@/components/dashboard/HydrationCard'; // Importando o card de hidratação

const Dashboard = () => {
  const { profile } = useAuth();
  const { estatisticas, isLoading: isProgressLoading } = useProgress();
  const { userWorkouts, isLoading: isWorkoutLoading } = useWorkout();

  const nextWorkout = userWorkouts.length > 0 ? userWorkouts[0] : null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Olá, {profile?.full_name || 'Usuário'}!</h1>
        <p className="text-muted-foreground">Aqui está um resumo da sua jornada hoje.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card de Resumo Diário (agora mais simples) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span>Próximo Treino</span>
              </div>
              <span className="font-medium">{nextWorkout ? nextWorkout.name : 'Nenhum agendado'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pizza className="h-5 w-5 text-orange-500" />
                <span>Calorias</span>
              </div>
               <div className="w-24 text-right">
                <span className="text-sm text-muted-foreground">Em breve</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Hidratação Dinâmico (NOVO) */}
        <HydrationCard />

        {/* Cards de Estatísticas Rápidas */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{profile?.weight || 0} kg</div>
                <p className="text-xs text-muted-foreground">
                    <Link to="/progress" className="hover:underline">Adicionar novo registro</Link>
                </p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinos Salvos</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{isWorkoutLoading ? '...' : userWorkouts.length}</div>
                 <p className="text-xs text-muted-foreground">
                    <Link to="/workouts" className="hover:underline">Ver ou gerar treinos</Link>
                </p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">{isProgressLoading ? '...' : estatisticas.metasConcluidas}</div>
                <p className="text-xs text-muted-foreground">Total de metas alcançadas</p>
            </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;