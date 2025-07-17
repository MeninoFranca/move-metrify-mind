import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dumbbell, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(registerData.password);
  const getStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-destructive";
    if (strength < 50) return "bg-warning";
    if (strength < 75) return "bg-accent";
    return "bg-success";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 25) return "Fraca";
    if (strength < 50) return "Regular";
    if (strength < 75) return "Boa";
    return "Forte";
  };

  // Form validation
  const isLoginValid = loginData.email && loginData.password;
  const isRegisterValid = 
    registerData.name &&
    registerData.email &&
    registerData.password &&
    registerData.confirmPassword &&
    registerData.password === registerData.confirmPassword &&
    registerData.acceptTerms &&
    passwordStrength >= 50;

  // Simulated authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, accept any email/password
    if (loginData.email && loginData.password) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
        variant: "default",
      });
      
      // Store user data in localStorage for demo
      localStorage.setItem("fitpro_user", JSON.stringify({
        email: loginData.email,
        name: loginData.email.split('@')[0],
        loginTime: new Date().toISOString()
      }));
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegisterValid) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Conta criada com sucesso!",
      description: "Você será redirecionado para o onboarding...",
      variant: "default",
    });
    
    // Store user data for demo
    localStorage.setItem("fitpro_user", JSON.stringify({
      email: registerData.email,
      name: registerData.name,
      loginTime: new Date().toISOString(),
      isNewUser: true
    }));
    
    setTimeout(() => {
      navigate("/onboarding");
    }, 1000);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero opacity-5"></div>
      
      {/* Back to home */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-muted-foreground hover:text-primary transition-smooth"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao início
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold hero-title">FitPro</span>
          </div>
          <p className="text-muted-foreground">
            Transforme seu fitness com inteligência artificial
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-strong glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {activeTab === "login" ? "Fazer Login" : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login" 
                ? "Entre na sua conta para continuar" 
                : "Comece sua jornada fitness hoje mesmo"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-smooth"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => 
                          setLoginData(prev => ({ ...prev, rememberMe: !!checked }))
                        }
                      />
                      <Label htmlFor="remember" className="text-sm">Lembrar-me</Label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary btn-fitness"
                    disabled={!isLoginValid || isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha forte"
                        className="pl-10 pr-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-smooth"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {registerData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Força da senha:</span>
                          <span className={`font-semibold ${
                            passwordStrength >= 75 ? 'text-success' :
                            passwordStrength >= 50 ? 'text-accent' :
                            passwordStrength >= 25 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        className="pl-10 pr-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-smooth"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {registerData.confirmPassword && (
                      <div className="flex items-center space-x-2 text-sm">
                        {registerData.password === registerData.confirmPassword ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-success">Senhas coincidem</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-destructive">Senhas não coincidem</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={registerData.acceptTerms}
                      onCheckedChange={(checked) => 
                        setRegisterData(prev => ({ ...prev, acceptTerms: !!checked }))
                      }
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      Aceito os{" "}
                      <a href="#" className="text-primary hover:underline">
                        Termos de Uso
                      </a>{" "}
                      e{" "}
                      <a href="#" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary btn-fitness"
                    disabled={!isRegisterValid || isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Social Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline" className="btn-fitness">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="btn-fitness">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Notice */}
        <Card className="mt-6 bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-accent mb-1">Modo Demo</p>
                <p className="text-muted-foreground">
                  Para testar o sistema, use qualquer email e senha. 
                  A autenticação está simplificada para demonstração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;