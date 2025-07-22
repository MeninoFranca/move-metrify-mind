import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      await signIn({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error?.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (error?.message?.includes('Email not confirmed')) {
        setError('Por favor, confirme seu email antes de fazer login');
      } else {
        setError('Erro ao fazer login. Por favor, tente novamente.');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validações adicionais
    const password = formData.get('password') as string;
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const height = Number(formData.get('height'));
    if (height && (height < 100 || height > 250)) {
      setError('Altura deve estar entre 100cm e 250cm');
      return;
    }

    const weight = Number(formData.get('weight'));
    if (weight && (weight < 30 || weight > 300)) {
      setError('Peso deve estar entre 30kg e 300kg');
      return;
    }

    const age = Number(formData.get('age'));
    if (age && (age < 13 || age > 100)) {
      setError('Idade deve estar entre 13 e 100 anos');
      return;
    }
    
    try {
      await signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        fullName: formData.get('fullName') as string,
        age: formData.get('age') ? Number(formData.get('age')) : undefined,
        height: formData.get('height') ? Number(formData.get('height')) : undefined,
        weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
        fitnessGoal: formData.get('fitnessGoal') as any || undefined,
        experienceLevel: formData.get('experienceLevel') as any || undefined,
        availableEquipment: formData.getAll('availableEquipment') as any[] || undefined,
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      if (error?.message?.includes('already registered')) {
        setError('Este email já está cadastrado');
      } else if (error?.message?.includes('valid email')) {
        setError('Por favor, insira um email válido');
      } else if (error?.message?.includes('password')) {
        setError('A senha deve ter pelo menos 6 caracteres');
      } else if (error?.code === '23505') { // Erro de chave única
        setError('Este email já está em uso');
      } else if (error?.code === '23502') { // Erro de campo obrigatório
        setError('Por favor, preencha todos os campos obrigatórios');
      } else {
        setError(`Erro ao criar conta: ${error.message || 'Tente novamente'}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Move Metrify Mind</CardTitle>
          <CardDescription className="text-center">
            Sua jornada para uma vida mais saudável começa aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value as 'login' | 'register');
            setError(null);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Ex: 25"
                      min="13"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Nível de Experiência</Label>
                    <Select name="experienceLevel">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      placeholder="Ex: 170"
                      min="100"
                      max="250"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      placeholder="Ex: 70"
                      min="30"
                      max="300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal">Objetivo</Label>
                  <Select name="fitnessGoal">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Perda de Peso</SelectItem>
                      <SelectItem value="gain_muscle">Ganho de Massa</SelectItem>
                      <SelectItem value="maintain_weight">Manutenção</SelectItem>
                      <SelectItem value="increase_endurance">Melhorar Resistência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Equipamentos Disponíveis</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="availableEquipment" value="full_gym" className="rounded" />
                      <span>Academia Completa</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="availableEquipment" value="dumbbells" className="rounded" />
                      <span>Halteres</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="availableEquipment" value="bodyweight" className="rounded" />
                      <span>Peso Corporal</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="availableEquipment" value="resistance_bands" className="rounded" />
                      <span>Faixas Elásticas</span>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === 'login' ? (
            <p>Não tem uma conta? Clique em Cadastro acima</p>
          ) : (
            <p>Já tem uma conta? Clique em Login acima</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}