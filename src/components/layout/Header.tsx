import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Bell } from 'lucide-react';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-background">
      {/* Menu Mobile */}
      <div className="flex items-center space-x-4">
        <MobileMenu />
        <div className="lg:hidden font-semibold text-lg">
          MetrifyMind
        </div>
      </div>

      {/* Área direita */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* Toggle de Tema */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Avatar do Usuário */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            src="https://github.com/shadcn.png"
            alt="Avatar do usuário"
            className="h-8 w-8 rounded-full"
          />
        </Button>
      </div>
    </header>
  );
};

export default Header; 