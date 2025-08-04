import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
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
  Sparkles,
  LogOut,
  BarChart3,
  Utensils,
  Menu,
  X
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
    description: 'Gerador 100% personalizado',
    badge: 'AI'
  },
  { 
    icon: Utensils, 
    label: 'Dieta', 
    path: '/nutrition',
    description: 'Planner personalizado'
  },
  { 
    icon: BarChart3, 
    label: 'Progresso', 
    path: '/progress',
    description: 'Tracking completo'
  },
  { 
    icon: Calendar, 
    label: 'Calendário', 
    path: '/calendar',
    description: 'Planejamento visual'
  },
  { 
    icon: User, 
    label: 'Perfil', 
    path: '/profile',
    description: 'Informações pessoais'
  },
  { 
    icon: Settings, 
    label: 'Configurações', 
    path: '/settings',
    description: 'Personalização sistema'
  },
];

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl gradient-primary shadow-glow">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold">Move Metrify Mind</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              AI
            </Badge>
          </div>
        </div>

        {/* User Avatar e Menu */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header do Sheet */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl gradient-primary shadow-glow">
                        <Dumbbell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-bold">Move Metrify Mind</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{profile?.full_name || 'Usuário'}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.fitness_goal === 'lose_weight' && '🎯 Perder peso'}
                        {profile?.fitness_goal === 'gain_muscle' && '💪 Ganhar massa'}
                        {profile?.fitness_goal === 'maintain_weight' && '⚖️ Manter forma'}
                        {profile?.fitness_goal === 'increase_endurance' && '🏃 Aumentar resistência'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu de Navegação */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={handleLinkClick}
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
                            <Icon className="h-5 w-5" />
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
                  </div>
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start space-x-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </Button>
                </div>

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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;