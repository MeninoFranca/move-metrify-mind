import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Dumbbell, 
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Mail,
  Lock,
  User,
  Gift
} from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "Você deve aceitar os termos"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const trialSchema = z.object({
  email: z.string().email("Email inválido"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type TrialData = z.infer<typeof trialSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'trial'>('login');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Forms
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const password = registerForm.watch("password");

  // Calcular força da senha
  useEffect(() => {
    const calculateStrength = (pass: string) => {
      if (!pass) return 0;
      let score = 0;
      if (pass.length >= 8) score += 25;
      if (/[A-Z]/.test(pass)) score += 25;
      if (/[0-9]/.test(pass)) score += 25;
      if (/[^A-Za-z0-9]/.test(pass)) score += 25;
      return score;
    };
    setPasswordStrength(calculateStrength(password || ''));
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-destructive';
    if (passwordStrength < 75) return 'bg-warning';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Muito fraca';
    if (passwordStrength < 50) return 'Fraca';
    if (passwordStrength < 75) return 'Boa';
    return 'Forte';
  };

  // Handlers
  const handleLogin = async (data: LoginData) => {
    setError(null);
    try {
      await signIn({ email: data.email, password: data.password });
      navigate('/dashboard');
    } catch (error: any) {
      setError('Email ou senha incorretos. Verifique suas credenciais.');
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setError(null);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      navigate('/onboarding');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  const passwordRequirements = [
    { met: (password?.length || 0) >= 8, text: "Pelo menos 8 caracteres" },
    { met: /[A-Z]/.test(password || ''), text: "Uma letra maiúscula" },
    { met: /[0-9]/.test(password || ''), text: "Um número" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 shadow-strong">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-xl gradient-primary shadow-glow">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">FitPro</CardTitle>
            <CardDescription className="text-lg">
              Sua jornada fitness inteligente começa aqui
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value as 'login' | 'register');
            setError(null);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-sm">Cadastro</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Bem-vindo de volta!</h3>
                <p className="text-muted-foreground">Entre na sua conta para continuar</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="seu@email.com"
                    {...loginForm.register("email")}
                    className="h-12"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Senha
                  </Label>
                  <div className="relative">
                    <Input 
                      id="login-password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      {...loginForm.register("password")}
                      className="h-12 pr-12"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-12 gradient-primary" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entrando...
                    </div>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Crie sua conta</h3>
                <p className="text-muted-foreground">Comece sua transformação hoje</p>
              </div>

              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Nome Completo
                  </Label>
                  <Input 
                    id="fullName" 
                    placeholder="Seu nome completo"
                    {...registerForm.register("fullName")}
                    className="h-12"
                  />
                  {registerForm.formState.errors.fullName && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="seu@email.com"
                    {...registerForm.register("email")}
                    className="h-12"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Senha
                  </Label>
                  <div className="relative">
                    <Input 
                      id="register-password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha forte"
                      {...registerForm.register("password")}
                      className="h-12 pr-12"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Força da senha:</span>
                        <span className={`font-medium ${passwordStrength >= 75 ? 'text-success' : passwordStrength >= 50 ? 'text-warning' : 'text-destructive'}`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className={`h-2 ${getPasswordStrengthColor()}`} />
                      
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center text-xs">
                            {req.met ? (
                              <Check className="h-3 w-3 text-success mr-2" />
                            ) : (
                              <X className="h-3 w-3 text-muted-foreground mr-2" />
                            )}
                            <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      {...registerForm.register("confirmPassword")}
                      className="h-12 pr-12"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    {...registerForm.register("terms")}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                    Eu aceito os <a href="#" className="text-primary hover:underline">termos de uso</a> e 
                    <a href="#" className="text-primary hover:underline ml-1">política de privacidade</a>
                  </Label>
                </div>
                {registerForm.formState.errors.terms && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.terms.message}</p>
                )}

                <Button type="submit" className="w-full h-12 gradient-primary" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando conta...
                    </div>
                  ) : (
                    <>
                      Criar Conta Gratuita
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="text-xs">
              <Shield className="mr-1 h-3 w-3" />
              Dados Seguros
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Zap className="mr-1 h-3 w-3" />
              Setup Rápido
            </Badge>
          </div>
          
          {activeTab === 'login' ? (
            <p>Não tem uma conta? <button onClick={() => setActiveTab('register')} className="text-primary hover:underline font-medium">Cadastre-se grátis</button></p>
          ) : activeTab === 'register' ? (
            <p>Já tem uma conta? <button onClick={() => setActiveTab('login')} className="text-primary hover:underline font-medium">Faça login</button></p>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}