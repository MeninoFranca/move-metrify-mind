import React from 'react';
import ModernSidebar from './ModernSidebar';
import MobileHeader from './MobileHeader';

interface ModernLayoutProps {
  children: React.ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <div className="flex">
        <ModernSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;