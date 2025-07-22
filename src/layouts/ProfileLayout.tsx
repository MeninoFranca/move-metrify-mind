import React from 'react';
import { useUser } from '@/contexts/UserContext';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const { usuario } = useUser();

  if (!usuario) return null;

  return (
    <div className="container mx-auto p-6">
      {children}
    </div>
  );
};

export default ProfileLayout; 