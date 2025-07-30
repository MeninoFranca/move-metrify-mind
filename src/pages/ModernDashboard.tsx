import React from 'react';
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
  Plus,
  Sparkles,
  Heart,
  Timer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import OverviewCards from '@/components/dashboard/OverviewCards';
import ModernSidebar from '@/components/layout/ModernSidebar';

const ModernDashboard = () => {
  const { profile } = useAuth();
  const { estatisticas, isLoading: isProgressLoading } = useProgress();
  const { userWorkouts, isLoading: isWorkoutLoading } = useWorkout();

  const nextWorkout = userWorkouts.length > 0 ? userWorkouts[0] : null;

  // Dados simulados para demonstração das funcionalidades
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
    },
    { 
      title: 'Plano Nutricional', 
      completed: true,
      type: 'nutrition',
      icon: <Pizza className="h-4 w-4" />
    }
  ];

  const achievements = [
    { name: 'Primeira Semana', icon: '🎯', earned: true, date: 'Hoje' },
    { name: 'Consistência', icon: '🔥', earned: true, date: 'Ontem' },
    { name: 'Hidratação', icon: '💧', earned: false, progress: 75 },
    { name: 'Peso Meta', icon: '⚖️', earned: false, progress: 60 }
  ];

  const weeklyActivities = [
    { day: 'Seg', completed: true, type: 'workout' },
    { day: 'Ter', completed: true, type: 'nutrition' },
    { day: 'Qua', completed: false, type: 'workout' },
    { day: 'Qui', completed: true, type: 'hydration' },
    { day: 'Sex', completed: true, type: 'workout' },
    { day: 'Sáb', completed: false, type: 'rest' },
    { day: 'Dom', completed: false, type: 'workout' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        <ModernSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b bg-background/95 backdrop-blur-lg flex items-center px-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                Dashboard Principal
              </h1>
              <p className="text-sm text-muted-foreground">
                Visão geral do seu progresso fitness
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agenda
                </Link>
              </Button>
              <Button className="gradient-primary" size="sm" asChild>
                <Link to="/workouts">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Treino
                </Link>
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">
                    Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Aqui está seu resumo de hoje. Continue assim e alcance seus objetivos!
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>Nível {profile?.experience_level === 'beginner' ? 'Iniciante' : profile?.experience_level === 'intermediate' ? 'Intermediário' : 'Avançado'}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Timer className="h-3 w-3" />
                      <span>12 dias ativo</span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Overview Cards - Estatísticas animadas */}
              <OverviewCards weeklyStats={weeklyStats} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Próximo Treino - Área principal */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Dumbbell className="mr-2 h-5 w-5" />
                      Módulo Treinos - Gerador 100% Personalizado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {nextWorkout ? (
                      <div className="space-y-6">
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
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Target className="mr-1 h-4 w-4" />
                            {nextWorkout.workout_exercises?.length || 0} exercícios
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-1 h-4 w-4" />
                            Intensidade baseada em nível
                          </div>
                          <div className="flex items-center">
                            <Activity className="mr-1 h-4 w-4" />
                            IA personalizada
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button className="gradient-primary" asChild>
                            <Link to="/workout/execute">
                              <Activity className="mr-2 h-4 w-4" />
                              Iniciar Treino
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to="/workouts">
                              Ver Biblioteca
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Algoritmo de Personalização</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Baseado em seu perfil, vamos gerar treinos 100% personalizados com IA avançada
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-sm font-medium">Tipo</div>
                            <div className="text-xs text-muted-foreground">Auto-seleção</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-sm font-medium">Duração</div>
                            <div className="text-xs text-muted-foreground">15-90min</div>
                          </div>
                        </div>
                        <Button className="gradient-primary" asChild>
                          <Link to="/workouts">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Gerar Treino Personalizado
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
                          <div className={`p-2 rounded-full transition-all ${
                            goal.completed 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted hover:bg-primary/10'
                          }`}>
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
                              <div className="mt-1">
                                <Progress value={goal.progress} className="h-1" />
                                <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Atividade Semanal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Atividade Semanal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end space-x-2 mb-4">
                      {weeklyActivities.map((day, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-16 rounded-lg transition-all ${
                            day.completed 
                              ? 'bg-gradient-primary shadow-glow' 
                              : 'bg-muted'
                          }`} style={{
                            height: day.completed ? '3rem' : '1rem'
                          }} />
                          <span className="text-xs text-muted-foreground">{day.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{weeklyStats.workoutsCompleted}</div>
                        <div className="text-xs text-muted-foreground">Treinos realizados</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{weeklyStats.averageWorkoutTime}</div>
                        <div className="text-xs text-muted-foreground">Min médio/treino</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Conquistas - Sistema Gamificação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      Sistema Gamificação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.map((achievement, index) => (
                        <div 
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            achievement.earned 
                              ? 'bg-primary/5 border-primary/20' 
                              : 'bg-muted/50 border-muted'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{achievement.icon}</span>
                            <div>
                              <div className="text-sm font-medium">{achievement.name}</div>
                              {achievement.earned ? (
                                <div className="text-xs text-success">{achievement.date}</div>
                              ) : (
                                <div className="text-xs text-muted-foreground">
                                  {achievement.progress}% completo
                                </div>
                              )}
                            </div>
                          </div>
                          {achievement.earned && (
                            <Badge variant="secondary" className="text-xs">
                              ✨ Conquistado
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

                {/* Estatísticas Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Estatísticas Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                        <div className="text-2xl font-bold text-primary">{isWorkoutLoading ? '...' : userWorkouts.length}</div>
                        <div className="text-sm text-muted-foreground">Treinos Salvos</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5">
                        <div className="text-2xl font-bold text-success">{isProgressLoading ? '...' : estatisticas.metasConcluidas}</div>
                        <div className="text-sm text-muted-foreground">Metas Concluídas</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                        <div className="text-2xl font-bold text-orange-500">{weeklyStats.caloriesBurned}</div>
                        <div className="text-sm text-muted-foreground">Calorias Queimadas</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                        <div className="text-2xl font-bold text-blue-500">12</div>
                        <div className="text-sm text-muted-foreground">Dias Ativos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;