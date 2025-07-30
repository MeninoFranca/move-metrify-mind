import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Flame, 
  Scale, 
  Target,
  Activity,
  Droplets
} from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';

interface OverviewCardsProps {
  weeklyStats: {
    workoutsCompleted: number;
    workoutsPlanned: number;
    caloriesBurned: number;
    averageWorkoutTime: number;
  };
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ weeklyStats }) => {
  const { hydrationToday } = useProgress();
  const { profile } = useAuth();

  const hydrationProgress = hydrationToday 
    ? (hydrationToday.consumed_ml / hydrationToday.daily_goal_ml) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Progresso Semanal */}
      <Card className="hover:shadow-medium transition-all duration-300 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso Semanal</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {weeklyStats.workoutsCompleted}/{weeklyStats.workoutsPlanned}
          </div>
          <Progress 
            value={(weeklyStats.workoutsCompleted / weeklyStats.workoutsPlanned) * 100} 
            className="mb-2 h-2" 
          />
          <p className="text-xs text-muted-foreground">
            Treinos desta semana • {Math.round((weeklyStats.workoutsCompleted / weeklyStats.workoutsPlanned) * 100)}% completo
          </p>
        </CardContent>
      </Card>

      {/* Calorias Queimadas */}
      <Card className="hover:shadow-medium transition-all duration-300 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calorias Queimadas</CardTitle>
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{weeklyStats.caloriesBurned}</div>
          <div className="flex items-center mb-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: '75%' }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-muted-foreground">75%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Meta semanal: 1.600 kcal
          </p>
        </CardContent>
      </Card>

      {/* Hidratação */}
      <Card className="hover:shadow-medium transition-all duration-300 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Droplets className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {hydrationToday ? Math.round(hydrationToday.consumed_ml / 1000 * 10) / 10 : 0}L
          </div>
          <Progress 
            value={hydrationProgress} 
            className="mb-2 h-2"
          />
          <p className="text-xs text-muted-foreground">
            Meta diária: {hydrationToday ? hydrationToday.daily_goal_ml / 1000 : 2.5}L • {Math.round(hydrationProgress)}%
          </p>
        </CardContent>
      </Card>

      {/* Meta Atingida */}
      <Card className="hover:shadow-medium transition-all duration-300 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meta Atingida</CardTitle>
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
            <Target className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{profile?.weight || 0} kg</div>
          <div className="flex items-center mb-2">
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="mr-1 h-3 w-3" />
              -2.3kg este mês
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Meta peso ideal
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCards;