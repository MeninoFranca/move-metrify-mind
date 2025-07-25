import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Scale, 
  Activity, 
  Dumbbell, 
  Pizza, 
  Droplets,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Flame,
  Award,
  Zap,
  BarChart3,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import HydrationCard from '@/components/dashboard/HydrationCard';

const Dashboard = () => {
  const { profile } = useAuth();
  const { estatisticas, isLoading: isProgressLoading } = useProgress();
  const { userWorkouts, isLoading: isWorkoutLoading } = useWorkout();

  const nextWorkout = userWorkouts.length > 0 ? userWorkouts[0] : null;

  // Dados simulados para demonstração
  const weeklyStats = {
    workoutsCompleted: 4,
    workoutsPlanned: 5,
    caloriesBurned: 1250,
    averageWorkoutTime: 42
  };

  const todayGoals = [
    { 
      title: 'Treino de Força', 
      completed: false, 
      time: '18:00',
      type: 'workout',
      icon: <Dumbbell className="h-4 w-4" />
    },
    { 
      title: 'Hidratação (2.5L)', 
      completed: true, 
      progress: 85,
      type: 'hydration',
      icon: <Droplets className="h-4 w-4" />
    },
    { 
      title: 'Registrar Peso', 
      completed: false,
      type: 'measurement',
      icon: <Scale className="h-4 w-4" />
    }
  ];

  const achievements = [
    { name: 'Primeira Semana', icon: '🎯', earned: true },
    { name: 'Consistência', icon: '🔥', earned: true },
    { name: 'Hidratação', icon: '💧', earned: false },
    { name: 'Peso Meta', icon: '⚖️', earned: false }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">
              Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Aqui está seu resumo de hoje. Continue assim!
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link to="/workouts">
                <Plus className="mr-2 h-4 w-4" />
                Novo Treino
              </Link>
            </Button>
            <Button className="gradient-primary" asChild>
              <Link to="/progress">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Progresso
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Progresso Semanal */}
          <Card className="hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Semanal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyStats.workoutsCompleted}/{weeklyStats.workoutsPlanned}</div>
              <Progress value={(weeklyStats.workoutsCompleted / weeklyStats.workoutsPlanned) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Treinos desta semana
              </p>
            </CardContent>
          </Card>

          {/* Calorias Queimadas */}
          <Card className="hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorias Queimadas</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyStats.caloriesBurned}</div>
              <div className="flex items-center mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-muted-foreground">75%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Meta semanal: 1.600 kcal
              </p>
            </CardContent>
          </Card>

          {/* Hidratação */}
          <HydrationCard />

          {/* Peso Atual */}
          <Card className="hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.weight || 0} kg</div>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  -2.3kg este mês
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <Link to="/progress" className="hover:underline text-primary">
                  Adicionar novo registro
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximo Treino */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5" />
                Próximo Treino
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextWorkout ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{nextWorkout.name}</h3>
                      <p className="text-muted-foreground">
                        {nextWorkout.workout_type} • {nextWorkout.duration_minutes} min
                      </p>
                    </div>
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      Hoje, 18:00
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Target className="mr-1 h-4 w-4" />
                      {nextWorkout.workout_exercises?.length || 0} exercícios
                    </div>
                    <div className="flex items-center">
                      <Zap className="mr-1 h-4 w-4" />
                      Intensidade média
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button className="gradient-primary flex-1" asChild>
                      <Link to="/workout/execute">
                        <Activity className="mr-2 h-4 w-4" />
                        Iniciar Treino
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/workouts">
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum treino agendado</h3>
                  <p className="text-muted-foreground mb-4">
                    Que tal gerar um treino personalizado?
                  </p>
                  <Button className="gradient-primary" asChild>
                    <Link to="/workouts">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gerar Treino
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metas de Hoje */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Metas de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${goal.completed ? 'bg-success/10 text-success' : 'bg-muted'}`}>
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {goal.title}
                        </span>
                        {goal.time && (
                          <Badge variant="outline" className="text-xs">
                            {goal.time}
                          </Badge>
                        )}
                      </div>
                      {goal.progress && (
                        <Progress value={goal.progress} className="mt-1 h-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{isWorkoutLoading ? '...' : userWorkouts.length}</div>
                  <div className="text-sm text-muted-foreground">Treinos Salvos</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{isProgressLoading ? '...' : estatisticas.metasConcluidas}</div>
                  <div className="text-sm text-muted-foreground">Metas Concluídas</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{weeklyStats.averageWorkoutTime}</div>
                  <div className="text-sm text-muted-foreground">Min/Treino</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Dias Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Conquistas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      achievement.earned 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/50 border-muted opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-sm font-medium">{achievement.name}</div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Conquistado!
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/progress">
                  Ver Todas as Conquistas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;