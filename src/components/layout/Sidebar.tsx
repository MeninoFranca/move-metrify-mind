import React from 'react';
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
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Dumbbell, label: 'Treinos', path: '/workouts' },
  { icon: Apple, label: 'Nutrição', path: '/nutrition' },
  { icon: LineChart, label: 'Progresso', path: '/progress' },
  { icon: Calendar, label: 'Calendário', path: '/calendar' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-background">
      {/* Logo */}
      <div className="h-16 border-b flex items-center px-6">
        <span className="text-xl font-bold">MetrifyMind</span>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Versão */}
      <div className="p-4 text-sm text-muted-foreground">
        <p>Versão 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar; 