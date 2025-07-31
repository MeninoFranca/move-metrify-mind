import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModernLayout from '@/components/layout/ModernLayout';

export default function Settings() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <ModernLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="destructive">
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
}