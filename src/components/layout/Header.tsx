import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Bell, User } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useStripe } from '@/hooks/useStripe';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth(); // 2. Obtenha os dados do usuário e a função signOut
  const { getActiveSubscription } = useStripe();

  const activeSubscription = getActiveSubscription();

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
        {/* Subscription Badge */}
        {activeSubscription && (
          <Badge variant="secondary" className="hidden sm:flex">
            {activeSubscription.name}
          </Badge>
        )}

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

        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'Avatar'} />
                <AvatarFallback>
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link to="/settings">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/subscription">Assinatura</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;