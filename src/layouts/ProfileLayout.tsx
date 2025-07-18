import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { usuario } = useUser();

  if (!usuario) return null;

  const menuItems = [
    {
      path: '/profile',
      label: 'Perfil',
      icon: '👤'
    },
    {
      path: '/settings',
      label: 'Configurações',
      icon: '⚙️'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-4">
                {usuario.foto ? (
                  <img
                    src={usuario.foto}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Foto
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">{usuario.nome}</h2>
              <p className="text-sm text-gray-500">{usuario.email}</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block w-full"
                >
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Objetivo:</span>
                  <span className="ml-2 capitalize">
                    {usuario.objetivo.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Nível:</span>
                  <span className="ml-2 capitalize">
                    {usuario.experienciaTreino}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Atividade:</span>
                  <span className="ml-2 capitalize">
                    {usuario.nivelAtividade.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 