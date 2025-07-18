import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Dumbbell, Droplets, Pizza, Bell } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card de Resumo Diário */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Resumo Diário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span>Próximo Treino</span>
              </div>
              <span className="font-medium">14:00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span>Hidratação</span>
              </div>
              <div className="w-24">
                <Progress value={60} className="h-2" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pizza className="h-5 w-5 text-orange-500" />
                <span>Calorias</span>
              </div>
              <span className="font-medium">1200/2000</span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Progresso Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Progresso Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <LineChart className="h-32 w-32 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Gráfico em breve</span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Treino Hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Treino de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Treino A - Peito e Tríceps</span>
                <span className="text-sm text-muted-foreground">45 min</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Supino Reto 4x12</li>
                <li>• Crucifixo 3x15</li>
                <li>• Extensão de Tríceps 4x12</li>
                <li>• Mais 3 exercícios...</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Card de Metas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Peso Alvo</span>
                <Progress value={75} className="w-32 h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span>Treinos/Semana</span>
                <Progress value={60} className="w-32 h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span>Água/Dia</span>
                <Progress value={40} className="w-32 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Lembretes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Lembretes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '14:00', text: 'Treino: Peito e Tríceps' },
                { time: '16:30', text: 'Lanche da Tarde' },
                { time: '18:00', text: 'Beber água (500ml)' },
              ].map((reminder, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{reminder.time}</span>
                    <p className="text-sm text-muted-foreground">{reminder.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 