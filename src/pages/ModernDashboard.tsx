import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Dumbbell,
  Flame,
  HeartPulse,
  Plus,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  Droplets,
} from 'lucide-react';

// Hooks e Componentes do seu projeto
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- TIPOS E INTERFACES (Alinhados com o DB) ---
type WeeklyMetric = 'activeMinutes' | 'caloriesBurned' | 'workoutsCompleted';

// --- DADOS MOCK (Use como referência para conectar seus dados reais) ---
const mockGoals = [
    { id: 1, title: 'Perder 5kg', current: 2.5, target: 5, unit: 'kg' },
    { id: 2, title: 'Correr 10km', current: 7, target: 10, unit: 'km' },
];

const mockAchievements = [
  { name: 'Primeira Semana', icon: '🎯', earned: true },
  { name: 'Consistência', icon: '🔥', earned: true },
  { name: 'Hidratação', icon: '💧', earned: false },
  { name: 'Peso Meta', icon: '⚖️', earned: false }
];

// --- SUB-COMPONENTES DO DASHBOARD ---

// Componente para exibir um card de estatística com Skeleton para loading
const StatCard = ({ icon: Icon, title, value, unit, color, isLoading }) => (
  <Card className="hover:border-primary/50 transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </>
      ) : (
        <>
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{unit}</p>
        </>
      )}
    </CardContent>
  </Card>
);

// Componente para o gráfico interativo de resumo semanal
const WeeklySummaryChart = ({ isLoading }) => {
    // TODO: Substituir mockWeeklySummary por dados reais do seu hook de progresso.
    // Isso exigiria uma função no seu `progressService` para buscar e agregar
    // dados da tabela `activity_history` ou `workouts` dos últimos 7 dias.
    const mockWeeklySummary = {
        activeMinutes: [ { day: 'Seg', value: 60 }, { day: 'Ter', value: 75 }, { day: 'Qua', value: 0 }, { day: 'Qui', value: 90 }, { day: 'Sex', value: 45 }, { day: 'Sáb', value: 120 }, { day: 'Dom', value: 30 } ],
        caloriesBurned: [ { day: 'Seg', value: 450 }, { day: 'Ter', value: 550 }, { day: 'Qua', value: 50 }, { day: 'Qui', value: 700 }, { day: 'Sex', value: 350 }, { day: 'Sáb', value: 900 }, { day: 'Dom', value: 250 } ],
        workoutsCompleted: [ { day: 'Seg', value: 1 }, { day: 'Ter', value: 1 }, { day: 'Qua', value: 0 }, { day: 'Qui', value: 1 }, { day: 'Sex', value: 1 }, { day: 'Sáb', value: 1 }, { day: 'Dom', value: 0 } ],
    };

    const [metric, setMetric] = useState<WeeklyMetric>('activeMinutes');
    const metricConfig = {
        activeMinutes: { label: 'Minutos Ativos', unit: 'm', color: 'hsl(var(--primary))' },
        caloriesBurned: { label: 'Calorias Queimadas', unit: 'kcal', color: 'hsl(var(--chart-2))' },
        workoutsCompleted: { label: 'Treinos Completos', unit: '', color: 'hsl(var(--chart-3))' },
    };

    if (isLoading) {
        return (
            <Card className="lg:col-span-2">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
            </Card>
        );
    }

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Resumo da Semana</CardTitle>
                        <CardDescription>Seu progresso nos últimos 7 dias.</CardDescription>
                    </div>
                    <Select value={metric} onValueChange={(value: WeeklyMetric) => setMetric(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Selecione a métrica" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="activeMinutes">Minutos Ativos</SelectItem>
                            <SelectItem value="caloriesBurned">Calorias</SelectItem>
                            <SelectItem value="workoutsCompleted">Treinos Completos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={mockWeeklySummary[metric]}>
                        <defs><linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={metricConfig[metric].color} stopOpacity={0.8}/><stop offset="95%" stopColor={metricConfig[metric].color} stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}${metricConfig[metric].unit}`} />
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                        <Area type="monotone" dataKey="value" stroke={metricConfig[metric].color} fillOpacity={1} fill="url(#colorMetric)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Card de Próximo Treino, agora consumindo dados reais
const NextWorkoutCard = ({ workout, isLoading }) => (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5" />Próximo Treino</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : workout ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{workout.name}</h3>
                <p className="text-muted-foreground capitalize">{workout.workout_type} • {workout.duration_minutes} min</p>
              </div>
              <Badge variant="outline">Agendado</Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center"><Target className="mr-1 h-4 w-4" />{workout.workout_exercises?.length || 0} exercícios</div>
              <div className="flex items-center"><Zap className="mr-1 h-4 w-4" />Intensidade: {workout.intensity_level || 'N/A'}/10</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="gradient-primary flex-1" asChild>
                <Link to={`/workout/execute/${workout.id}`}>
                  <Activity className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Iniciar Treino</span>
                  <span className="sm:hidden">Iniciar</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/workouts/${workout.id}`}>
                  <span className="hidden sm:inline">Ver Detalhes</span>
                  <span className="sm:hidden">Detalhes</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum treino agendado</h3>
            <p className="text-muted-foreground mb-4">Que tal gerar um treino personalizado com IA?</p>
            <Button className="gradient-primary" asChild><Link to="/workouts"><Sparkles className="mr-2 h-4 w-4" />Gerar Treino</Link></Button>
          </div>
        )}
      </CardContent>
    </Card>
);

// Card de Metas de Longo Prazo, agora dinâmico
const GoalsProgressCard = ({ isLoading }) => {
    // TODO: Substituir mockGoals por dados reais da tabela `user_goals`
    // que viriam do seu `useProgress` context.
    const goals = mockGoals;

    return(
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />Metas de Longo Prazo</CardTitle>
                <CardDescription>Seu progresso em direção aos seus objetivos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <>
                        <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-2 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-2 w-full" /></div>
                    </>
                ) : goals.length > 0 ? (
                    goals.map(goal => (
                        <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <p className="text-sm font-medium">{goal.title}</p>
                                <p className="text-sm text-muted-foreground">{goal.current}{goal.unit} / {goal.target}{goal.unit}</p>
                            </div>
                            <Progress value={(goal.current / goal.target) * 100} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma meta definida ainda.</p>
                )}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full"><Plus className="h-4 w-4 mr-2"/>Adicionar Nova Meta</Button>
            </CardFooter>
        </Card>
    );
};

// Card de Conquistas - CORRIGIDO
const AchievementsCard = ({ isLoading }) => {
    // TODO: Substituir mockAchievements por dados da tabela `user_achievements`
    const achievements = mockAchievements;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="mr-2 h-5 w-5" />Conquistas</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
                        {achievements.map((ach, index) => (
                            <div key={index} className={`p-3 rounded-lg border text-center transition-all ${ach.earned ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-muted opacity-60'}`}>
                                <div className="text-2xl mb-1">{ach.icon}</div>
                                <div className="text-xs font-medium">{ach.name}</div>
                            </div>
                        ))}
                    </div>
                )}
                <Button variant="outline" className="w-full mt-4" asChild><Link to="/progress">Ver Todas<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </CardContent>
        </Card>
    );
};


// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
const Dashboard = () => {
  const { profile, isLoading: isAuthLoading } = useAuth();
  const { estatisticas, isLoading: isProgressLoading } = useProgress();
  const { userWorkouts, isLoading: isWorkoutLoading } = useWorkout();

  // Encontra o próximo treino que ainda não foi completado
  const nextWorkout = useMemo(() => 
    userWorkouts.find(w => !w.completed_at),
    [userWorkouts]
  );

  const isLoading = isAuthLoading || isProgressLoading || isWorkoutLoading;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            {isLoading ? (
                <>
                    <Skeleton className="h-7 sm:h-9 w-48 sm:w-64 mb-2" />
                    <Skeleton className="h-4 sm:h-6 w-60 sm:w-80" />
                </>
            ) : (
                <>
                    <h1 className="text-2xl sm:text-3xl font-bold">Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋</h1>
                    <p className="text-muted-foreground text-sm sm:text-lg">Aqui está seu resumo de hoje. Continue assim!</p>
                </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/workouts">
                <Plus className="mr-2 h-4 w-4" />
                <span className="sm:inline">Novo Treino</span>
              </Link>
            </Button>
            <Button className="gradient-primary w-full sm:w-auto" asChild>
              <Link to="/progress">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span className="sm:inline">Ver Progresso</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Grid de Estatísticas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={Zap}
            title="Treinos na Semana"
            value={estatisticas?.treinos_semana ?? 0}
            unit="de 5 treinos"
            color="text-yellow-500"
            isLoading={isProgressLoading}
          />
          <StatCard
            icon={Flame}
            title="Calorias Queimadas"
            value={estatisticas?.calorias_queimadas_semana ?? 0}
            unit="kcal esta semana"
            color="text-orange-500"
            isLoading={isProgressLoading}
          />
          <StatCard
            icon={HeartPulse}
            title="Tempo Médio"
            value={estatisticas?.tempo_medio_treino ?? 0}
            unit="minutos por treino"
            color="text-rose-500"
            isLoading={isProgressLoading}
          />
          <StatCard
            icon={Scale}
            title="Peso Atual"
            value={profile?.weight ?? 0}
            unit="kg"
            color="text-blue-500"
            isLoading={isAuthLoading}
          />
        </div>

        {/* Grid Principal (Gráfico e Cards Laterais) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <WeeklySummaryChart isLoading={isProgressLoading} />
          <GoalsProgressCard isLoading={isProgressLoading} />
        </div>

        {/* Grid Secundário (Próximo Treino e Conquistas) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <NextWorkoutCard workout={nextWorkout} isLoading={isWorkoutLoading} />
          <AchievementsCard isLoading={isProgressLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
