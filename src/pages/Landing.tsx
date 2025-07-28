import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Zap,
  Heart,
  Brain,
  Shield,
  Clock,
  Trophy,
  Apple,
  Droplets,
  Calendar,
  BarChart3,
  User,
  Menu,
  X
} from 'lucide-react';
import heroImage from '@/assets/hero-fitness.jpg';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const benefits = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Treinos Personalizados",
      description: "IA avançada cria treinos únicos baseados no seu perfil, objetivos e equipamentos disponíveis.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Apple className="h-8 w-8" />,
      title: "Nutrição Inteligente",
      description: "Planos alimentares calculados automaticamente com base nos seus objetivos e preferências.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progresso em Tempo Real",
      description: "Acompanhe sua evolução com gráficos detalhados, fotos e medições corporais.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Coaching Adaptativo",
      description: "Sistema que aprende com seus resultados e ajusta automaticamente seus treinos.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Gerador de Treinos IA",
      description: "Algoritmo proprietário que cria treinos únicos"
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Hidratação Inteligente",
      description: "Lembretes adaptativos baseados no seu peso e atividade"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Planejamento Visual",
      description: "Calendário interativo com arrastar e soltar"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Avançado",
      description: "Relatórios detalhados do seu progresso"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Sistema de Conquistas",
      description: "Gamificação para manter você motivado"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Dados Seguros",
      description: "Criptografia de ponta a ponta dos seus dados"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Perdeu 15kg em 4 meses",
      content: "O FitPro mudou completamente minha relação com exercícios. Os treinos personalizados são perfeitos para minha rotina!",
      rating: 5,
      avatar: "M"
    },
    {
      name: "João Santos",
      role: "Ganhou 8kg de massa muscular",
      content: "A IA realmente entende minhas necessidades. Nunca tive resultados tão rápidos e consistentes.",
      rating: 5,
      avatar: "J"
    },
    {
      name: "Ana Costa",
      role: "Maratonista amateur",
      content: "O sistema de hidratação e nutrição me ajudou a melhorar meu desempenho nas corridas significativamente.",
      rating: 5,
      avatar: "A"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Para começar sua jornada fitness",
      features: [
        "3 treinos gerados por mês",
        "Tracking básico de progresso",
        "Lembretes de hidratação",
        "Acesso limitado ao app"
      ],
      cta: "Começar Grátis",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Pro",
      price: "R$ 29",
      period: "/mês",
      description: "Para resultados sérios",
      features: [
        "Treinos ilimitados personalizados",
        "Planos nutricionais completos",
        "Analytics avançado",
        "Suporte prioritário",
        "Acesso a todos os recursos"
      ],
      cta: "Experimentar Grátis",
      popular: true,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Premium",
      price: "R$ 49",
      period: "/mês",
      description: "Para atletas e entusiastas",
      features: [
        "Tudo do plano Pro",
        "Coach pessoal virtual",
        "Relatórios médicos detalhados",
        "Integração com wearables",
        "Consultoria nutricional"
      ],
      cta: "Experimentar Grátis",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg gradient-primary shadow-glow">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">FitPro</span>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI
                </Badge>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#benefits" className="text-muted-foreground hover:text-primary transition-colors">
                Benefícios
              </a>
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Funcionalidades
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                Depoimentos
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Preços
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button className="gradient-primary" asChild>
                <Link to="/auth?tab=register">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-background py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#benefits" className="text-muted-foreground hover:text-primary transition-colors">
                  Benefícios
                </a>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Funcionalidades
                </a>
                <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                  Depoimentos
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Preços
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Entrar</Link>
                  </Button>
                  <Button className="gradient-primary" asChild>
                    <Link to="/auth?tab=register">Começar Grátis</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="inline-flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Powered by Advanced AI</span>
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Transforme seu{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    corpo
                  </span>
                  {' '}com IA
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A primeira plataforma fitness que combina inteligência artificial avançada 
                  com coaching personalizado para acelerar seus resultados.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-primary text-lg px-8" asChild>
                  <Link to="/auth?tab=register">
                    <Play className="mr-2 h-5 w-5" />
                    Começar Gratuitamente
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link to="/auth?tab=trial">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Trial Premium Grátis
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Resultados em 30 dias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
              <img 
                src={heroImage} 
                alt="FitPro App Interface" 
                className="relative rounded-2xl shadow-2xl border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-primary">
              <Heart className="mr-2 h-4 w-4" />
              Benefícios Únicos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Por que escolher o FitPro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa tecnologia revolucionária combina ciência, dados e IA para 
              entregar resultados que você nunca imaginou possíveis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-medium hover:shadow-large transition-all duration-500 hover:scale-105 group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${benefit.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-primary">
              <Zap className="mr-2 h-4 w-4" />
              Funcionalidades
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Tudo que você precisa em um só lugar
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl border hover:shadow-medium transition-all duration-300 hover:border-primary/20">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-primary">
              <Users className="mr-2 h-4 w-4" />
              Depoimentos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Histórias de transformação
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mais de 50.000 pessoas já transformaram suas vidas com o FitPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-medium hover:shadow-large transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-primary">
              <Award className="mr-2 h-4 w-4" />
              Planos e Preços
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece grátis e evolua conforme seus resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-2 ${plan.popular ? 'border-primary shadow-2xl scale-105' : 'border-border'} transition-all duration-300 hover:shadow-large`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-primary text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.popular ? 'gradient-primary' : ''}`} 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/auth?tab=register">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pronto para transformar sua vida?
            </h2>
            <p className="text-xl opacity-90">
              Junte-se a milhares de pessoas que já alcançaram seus objetivos com o FitPro. 
              Comece sua jornada de transformação hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link to="/auth?tab=register">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Começar Agora Grátis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/auth?tab=trial">
                  <Clock className="mr-2 h-5 w-5" />
                  Trial Premium 7 Dias
                </Link>
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Sem cartão de crédito • Cancele quando quiser • Suporte 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FitPro</span>
              </div>
              <p className="text-muted-foreground">
                Transformando vidas através da tecnologia e inteligência artificial.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 FitPro. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Badge variant="outline">Versão 2.0.0</Badge>
              <Badge variant="secondary">
                <Sparkles className="mr-1 h-3 w-3" />
                Powered by AI
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;