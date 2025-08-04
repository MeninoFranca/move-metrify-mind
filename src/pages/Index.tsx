import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Dumbbell, 
  Target, 
  Trophy, 
  Users,
  Star,
  Check,
  Activity,
  Heart,
  Zap,
  Calendar,
  ChefHat,
  BarChart3,
  Droplets,
  Shield,
  Smartphone,
  Clock,
  TrendingUp,
  Award,
  PlayCircle,
  Sparkles,
  Timer,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);
    
    return () => {
      clearInterval(testimonialInterval);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "IA Personalizada",
      description: "Algoritmo avançado que aprende com seus hábitos e adapta treinos e dietas em tempo real.",
      highlight: "Tecnologia Exclusiva",
      stats: "99.2% de precisão"
    },
    {
      icon: <Timer className="h-8 w-8 text-secondary" />,
      title: "Modo Execução Inteligente",
      description: "Interface durante treino com timers automáticos, tracking em tempo real e feedback instantâneo.",
      highlight: "Experiência Imersiva",
      stats: "Timer de precisão"
    },
    {
      icon: <Droplets className="h-8 w-8 text-accent" />,
      title: "Hidratação Adaptativa",
      description: "Sistema que considera peso, clima, atividade e horários para lembretes personalizados.",
      highlight: "Inteligência Contextual",
      stats: "Baseado em 35ml/kg"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Analytics Avançado",
      description: "Dashboards interativos com insights profundos sobre seu progresso e tendências.",
      highlight: "Dados Acionáveis",
      stats: "15+ métricas"
    },
    {
      icon: <Calendar className="h-8 w-8 text-secondary" />,
      title: "Planejamento Visual",
      description: "Calendário intuitivo com arrastar e soltar para organizar toda sua jornada fitness.",
      highlight: "Interface Moderna",
      stats: "Sincronização total"
    },
    {
      icon: <Trophy className="h-8 w-8 text-accent" />,
      title: "Gamificação Completa",
      description: "Sistema de conquistas, streaks e níveis que transforma fitness em uma experiência divertida.",
      highlight: "Motivação Constante",
      stats: "50+ conquistas"
    }
  ];

  const benefits = [
    {
      icon: <Target className="h-12 w-12 text-primary" />,
      title: "Resultados Científicos",
      description: "Metodologia baseada em pesquisas com acompanhamento personalizado para maximizar resultados.",
      stats: "95% veem resultados em 30 dias",
      color: "primary"
    },
    {
      icon: <Zap className="h-12 w-12 text-secondary" />,
      title: "Eficiência Máxima",
      description: "Treinos otimizados que se adaptam ao seu tempo disponível sem comprometer a qualidade.",
      stats: "Economize até 40% do tempo",
      color: "secondary"
    },
    {
      icon: <Heart className="h-12 w-12 text-accent" />,
      title: "Suporte Inteligente",
      description: "IA disponível 24/7 com respostas instantâneas e suporte humano especializado.",
      stats: "Resposta em menos de 1 hora",
      color: "accent"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empresária, 34 anos",
      content: "Incrível como o app se adaptou à minha rotina! Perdi 18kg em 5 meses com treinos de apenas 30 minutos. A IA realmente entende minhas necessidades.",
      rating: 5,
      avatar: "MS",
      result: "-18kg em 5 meses",
      image: "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400",
      verified: true
    },
    {
      name: "João Santos",
      role: "Personal Trainer, 28 anos", 
      content: "Como profissional, fico impressionado com a precisão dos treinos gerados. Uso com mais de 200 clientes e os resultados são consistentemente excelentes.",
      rating: 5,
      avatar: "JS",
      result: "200+ clientes atendidos",
      image: "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400",
      verified: true
    },
    {
      name: "Ana Costa",
      role: "Estudante, 22 anos",
      content: "O sistema de conquistas mudou minha vida! Nunca consegui manter uma rotina por mais de 2 semanas, agora já são 8 meses consecutivos. Viciante de forma saudável!",
      rating: 5,
      avatar: "AC",
      result: "8 meses de consistência",
      image: "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=400",
      verified: true
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 29",
      period: "por mês",
      description: "Ideal para começar sua jornada",
      features: [
        "Treinos personalizados básicos",
        "Plano nutricional simples", 
        "Tracking de progresso",
        "Hidratação inteligente",
        "Suporte por email",
        "Biblioteca de exercícios"
      ],
      popular: false,
      savings: null,
      cta: "Começar Básico"
    },
    {
      name: "Pro",
      price: "R$ 49",
      period: "por mês",
      description: "O mais escolhido pelos usuários",
      features: [
        "Treinos 100% personalizados",
        "Plano nutricional completo",
        "Sistema de conquistas",
        "Analytics avançado",
        "Calendário fitness visual",
        "Modo execução com timer",
        "Lista de compras automática",
        "Suporte prioritário"
      ],
      popular: true,
      savings: "Mais popular",
      cta: "Começar Pro"
    },
    {
      name: "Premium",
      price: "R$ 79", 
      period: "por mês",
      description: "Para resultados extraordinários",
      features: [
        "Tudo do plano Pro",
        "Consultoria pessoal mensal",
        "Receitas exclusivas premium",
        "Acesso antecipado a features",
        "Relatórios detalhados PDF",
        "Personal trainer virtual",
        "Integração com wearables",
        "Suporte 24/7 prioritário"
      ],
      popular: false,
      savings: "Máximo resultado",
      cta: "Começar Premium"
    }
  ];

  const stats = [
    { number: "50K+", label: "Usuários Ativos", icon: <Users className="h-6 w-6" /> },
    { number: "2M+", label: "Treinos Realizados", icon: <Dumbbell className="h-6 w-6" /> },
    { number: "95%", label: "Taxa de Sucesso", icon: <Trophy className="h-6 w-6" /> },
    { number: "4.9", label: "Avaliação Média", icon: <Star className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/95 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl gradient-primary shadow-glow">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold hero-title">FitPro</span>
              <Badge variant="secondary" className="ml-2 text-xs">AI Powered</Badge>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#funcionalidades" className="text-muted-foreground hover:text-primary transition-smooth font-medium">Funcionalidades</a>
            <a href="#beneficios" className="text-muted-foreground hover:text-primary transition-smooth font-medium">Benefícios</a>
            <a href="#depoimentos" className="text-muted-foreground hover:text-primary transition-smooth font-medium">Depoimentos</a>
            <a href="#precos" className="text-muted-foreground hover:text-primary transition-smooth font-medium">Preços</a>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to="/auth">
              <Button variant="outline" className="btn-fitness font-medium">Login</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary btn-fitness pulse-glow font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                Trial Gratuito
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              Seu <span className="hero-title">Personal Trainer</span>
              <br />Inteligente 24/7
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Treinos personalizados por IA, nutrição científica e acompanhamento completo. 
              <br className="hidden md:block" />
              <strong>Transforme seu corpo com inteligência artificial.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary btn-fitness pulse-glow text-lg px-8 py-4 shadow-strong">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Começar Trial Gratuito
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/subscription">
              <Button size="lg" variant="outline" className="btn-fitness text-lg px-8 py-4 border-2">
                  Ver Planos Premium
                Ver Demo Interativa
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section id="beneficios" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Target className="mr-2 h-4 w-4" />
              Por Que Escolher FitPro
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Resultados <span className="hero-title">Comprovados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tecnologia de ponta combinada com ciência do exercício para entregar resultados reais e duradouros.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className={`text-center p-8 hover:scale-105 transition-all duration-500 shadow-medium hover:shadow-strong border-l-4 border-l-${benefit.color}`}>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  <Badge variant="secondary" className="font-medium">
                    {benefit.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="funcionalidades" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Zap className="mr-2 h-4 w-4" />
              Tecnologia Avançada
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Funcionalidades <span className="hero-title">Revolucionárias</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cada feature foi desenvolvida para maximizar seus resultados e tornar sua jornada fitness mais eficiente e prazerosa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`p-6 hover:scale-105 transition-all duration-500 shadow-medium hover:shadow-strong ${currentFeature === index ? 'ring-2 ring-primary shadow-glow' : ''}`}>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <Badge variant="secondary" className="text-xs">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Users className="mr-2 h-4 w-4" />
              Histórias Reais
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Transformações <span className="hero-title">Inspiradoras</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conheça pessoas reais que transformaram suas vidas com o FitPro. Seus resultados podem ser os próximos!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 shadow-strong">
              <CardContent className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl italic leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-lg">{testimonials[currentTestimonial].name}</p>
                      {testimonials[currentTestimonial].verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="mr-1 h-3 w-3" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                    <Badge variant="outline" className="mt-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {testimonials[currentTestimonial].result}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicadores do carrossel */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentTestimonial === index ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preços Section */}
      <section id="precos" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Award className="mr-2 h-4 w-4" />
              Planos Transparentes
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Escolha Seu <span className="hero-title">Plano Ideal</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Todos os planos incluem trial gratuito de 7 dias. Cancele quando quiser, sem compromisso.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-8 text-center relative ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-strong' : 'shadow-medium'} hover:shadow-strong transition-all duration-500`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-medium">
                      <Sparkles className="mr-1 h-4 w-4" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                    {plan.savings && (
                      <Badge variant="secondary" className="mt-2">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/auth">
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-primary shadow-glow' : ''} btn-fitness font-medium`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <p className="text-xs text-muted-foreground">
                    Trial gratuito de 7 dias • Cancele quando quiser
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Clock className="mr-2 h-4 w-4" />
            Oferta Limitada
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Comece Sua Transformação
            <br />
            <span className="text-yellow-300">Hoje Mesmo!</span>
          </h2>
          
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Junte-se a mais de 50.000 pessoas que já estão transformando suas vidas com nossa IA fitness. 
            <br />
            <strong>Seus resultados começam agora.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="btn-fitness text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-strong">
                <Sparkles className="mr-2 h-5 w-5" />
                Trial Gratuito 7 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="btn-fitness text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
              <Smartphone className="mr-2 h-5 w-5" />
              Baixar App Mobile
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Sem compromisso
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Cancele quando quiser
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Suporte 24/7
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Resultados garantidos
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg gradient-primary">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FitPro</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Transformando vidas através da inteligência artificial aplicada ao fitness.
              </p>
              <div className="flex space-x-2">
                {stats.slice(0, 2).map((stat, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {stat.number} {stat.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#funcionalidades" className="hover:text-primary transition-smooth">Funcionalidades</a></li>
                <li><a href="#precos" className="hover:text-primary transition-smooth">Preços</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Demo Interativa</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">API Developers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Status do Sistema</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Comunidade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Cookies</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">LGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p>&copy; 2024 FitPro. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge variant="outline" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                Dados Protegidos
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Award className="mr-1 h-3 w-3" />
                ISO 27001
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;