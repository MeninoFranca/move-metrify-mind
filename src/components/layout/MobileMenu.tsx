import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Dumbbell,
  Apple,
  LineChart,
  Calendar,
  Settings,
  User,
  Droplets,
  History,
  Trophy,
  Sparkles
} from 'lucide-react';

const menuItems = [
  { 
    icon: Home, 
    label: 'Dashboard', 
    path: '/dashboard',
    description: 'Visão geral'
  },
  { 
    icon: Dumbbell, 
    label: 'Treinos', 
    path: '/workouts',
    description: 'IA personalizada',
    badge: 'AI'
  },
  { 
    icon: Apple, 
    label: 'Nutrição', 
    path: '/nutrition',
    description: 'Planos inteligentes'
  },
  { 
    icon: Droplets, 
    label: 'Hidratação', 
    path: '/hydration',
    description: 'Lembretes adaptativos'
  },
  { 
    icon: LineChart, 
    label: 'Progresso', 
    path: '/progress',
    description: 'Analytics avançado'
  },
  { 
    icon: Calendar, 
    label: 'Calendário', 
    path: '/calendar',
    description: 'Planejamento visual'
  },
  { 
    icon: History, 
    label: 'Histórico', 
    path: '/history',
    description: 'Atividades completas'
  },
  { 
    icon: Trophy, 
    label: 'Conquistas', 
    path: '/achievements',
    description: 'Sistema gamificado'
  },
  { 
    icon: User, 
    label: 'Perfil', 
    path: '/profile',
    description: 'Dados pessoais'
  },
  { 
    icon: Settings, 
    label: 'Configurações', 
    path: '/settings',
    description: 'Personalização'
  },
];

const MobileMenu = () => {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        {/* Header */}
        <div className="h-16 border-b flex items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gradient-primary shadow-glow">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">FitPro</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                AI
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-medium border border-primary/20'
                    : 'hover:bg-muted/50 hover:shadow-soft'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg transition-all',
                  isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs">
              Versão 2.0.0
            </Badge>
            <p className="text-xs text-muted-foreground">
              Powered by Advanced AI
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;