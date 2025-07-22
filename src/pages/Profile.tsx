import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layout/DashboardLayout'; // 1. Importe o DashboardLayout

export default function Profile() {
  const { user, profile } = useAuth();

  return (
    // 2. Envolva o conteúdo com o DashboardLayout
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Perfil</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={profile?.full_name || ''}
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  value={profile?.age || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  value={profile?.weight || ''}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  value={profile?.height || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo</Label>
                <Input
                  id="goal"
                  value={profile?.fitness_goal || ''}
                  disabled
                />
              </div>
            </div>
            <Button>Editar Perfil</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}