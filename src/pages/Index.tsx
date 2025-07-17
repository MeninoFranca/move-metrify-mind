import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fitness.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold hero-title">FitPro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#funcionalidades" className="text-muted-foreground hover:text-primary transition-smooth">Funcionalidades</a>
            <a href="#beneficios" className="text-muted-foreground hover:text-primary transition-smooth">Benefícios</a>
            <a href="#precos" className="text-muted-foreground hover:text-primary transition-smooth">Preços</a>
            <a href="#depoimentos" className="text-muted-foreground hover:text-primary transition-smooth">Depoimentos</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="btn-fitness">Login</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary btn-fitness pulse-glow">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transforme Seu <span className="hero-title">Fitness</span>
              <br />Com Inteligência Artificial
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Treinos personalizados, dietas inteligentes e acompanhamento completo.
              Seu personal trainer digital está aqui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary btn-fitness pulse-glow text-lg px-8 py-4">
                  Comece Seu Trial Gratuito
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="btn-fitness text-lg px-8 py-4">
                Ver Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto animate-fade-in-up">
            <div className="glass-card rounded-2xl p-1 shadow-strong">
              <img 
                src={heroImage} 
                alt="Interface do FitPro" 
                className="w-full rounded-xl shadow-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section id="beneficios" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por Que Escolher o <span className="hero-title">FitPro?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologia avançada para resultados reais. Seu sucesso é nossa missão.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-12 w-12 text-primary" />,
                title: "100% Personalizado",
                description: "Treinos e dietas criados especificamente para você, baseados nos seus objetivos e limitações."
              },
              {
                icon: <Zap className="h-12 w-12 text-secondary" />,
                title: "Resultados Rápidos",
                description: "Algoritmos inteligentes que se adaptam ao seu progresso para maximizar seus resultados."
              },
              {
                icon: <Heart className="h-12 w-12 text-accent" />,
                title: "Acompanhamento Total",
                description: "Monitore cada aspecto da sua jornada fitness com relatórios detalhados e insights valiosos."
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-8 hover:scale-105 transition-smooth shadow-medium hover:shadow-strong">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades <span className="hero-title">Completas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para alcançar seus objetivos fitness em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Dumbbell className="h-8 w-8 text-primary" />,
                title: "Treinos Personalizados",
                description: "IA cria treinos únicos baseados no seu perfil, equipamentos e objetivos."
              },
              {
                icon: <ChefHat className="h-8 w-8 text-secondary" />,
                title: "Plano Nutricional",
                description: "Dietas balanceadas com receitas e lista de compras automática."
              },
              {
                icon: <Activity className="h-8 w-8 text-accent" />,
                title: "Hidratação Inteligente",
                description: "Lembretes personalizados para manter você sempre hidratado."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-primary" />,
                title: "Progresso Detalhado",
                description: "Acompanhe peso, medidas e fotos com análises avançadas."
              },
              {
                icon: <Calendar className="h-8 w-8 text-secondary" />,
                title: "Calendário Fitness",
                description: "Organize treinos e refeições em uma agenda visual intuitiva."
              },
              {
                icon: <Trophy className="h-8 w-8 text-accent" />,
                title: "Sistema de Conquistas",
                description: "Ganhe badges e mantenha a motivação com gamificação."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:scale-105 transition-smooth shadow-medium hover:shadow-strong">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que Nossos <span className="hero-title">Usuários</span> Dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Histórias reais de transformação e sucesso com o FitPro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Empresária",
                content: "Perdi 15kg em 4 meses! Os treinos personalizados fizeram toda a diferença na minha rotina corrida.",
                rating: 5,
                avatar: "MS"
              },
              {
                name: "João Santos",
                role: "Personal Trainer",
                content: "Como profissional, indico o FitPro para todos os meus clientes. A personalização é impressionante!",
                rating: 5,
                avatar: "JS"
              },
              {
                name: "Ana Costa",
                role: "Estudante",
                content: "Finalmente consegui criar uma rotina consistente. O app me motiva todos os dias!",
                rating: 5,
                avatar: "AC"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-medium hover:shadow-strong transition-smooth">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
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

      {/* Preços Section */}
      <section id="precos" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos <span className="hero-title">Simples</span> e Transparentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua jornada fitness. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Básico",
                price: "R$ 29",
                period: "por mês",
                description: "Perfeito para iniciantes",
                features: [
                  "Treinos personalizados básicos",
                  "Plano nutricional simples",
                  "Acompanhamento de progresso",
                  "Suporte por email"
                ],
                popular: false
              },
              {
                name: "Pro",
                price: "R$ 49",
                period: "por mês",
                description: "Mais popular entre nossos usuários",
                features: [
                  "Treinos 100% personalizados",
                  "Plano nutricional completo",
                  "Hidratação inteligente",
                  "Análises detalhadas",
                  "Calendário fitness",
                  "Suporte prioritário"
                ],
                popular: true
              },
              {
                name: "Premium",
                price: "R$ 79",
                period: "por mês",
                description: "Para resultados máximos",
                features: [
                  "Tudo do plano Pro",
                  "Consultoria pessoal",
                  "Receitas exclusivas",
                  "Acesso antecipado",
                  "Suporte 24/7",
                  "Personal trainer virtual"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`p-8 text-center ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-strong' : 'shadow-medium'} hover:shadow-strong transition-smooth`}>
                {plan.popular && (
                  <div className="gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                    Mais Popular
                  </div>
                )}
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <div>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-primary' : ''} btn-fitness`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Começar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 gradient-hero text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto Para Transformar Sua Vida?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão alcançando seus objetivos com o FitPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="btn-fitness text-lg px-8 py-4">
                Trial Gratuito de 7 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="btn-fitness text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
              Falar com Especialista
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-6">
            Sem compromisso • Cancele quando quiser • Suporte 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FitPro</span>
              </div>
              <p className="text-muted-foreground">
                Transformando vidas através da tecnologia fitness.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Preços</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Termos</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FitPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
