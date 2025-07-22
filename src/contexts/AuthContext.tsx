import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, Profile, SignInData, SignUpData } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar usuário atual ao carregar
    checkUser();

    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id);
        setProfile(profile);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
      if (user) {
        const profile = await authService.getProfile(user.id);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (data: SignInData) => {
    try {
      setIsLoading(true);
      const { user } = await authService.signIn(data);
      setUser(user);
      if (user) {
        const profile = await authService.getProfile(user.id);
        setProfile(profile);
      }
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      const { user } = await authService.signUp(data);
      setUser(user);
      if (user) {
        const profile = await authService.getProfile(user.id);
        setProfile(profile);
      }
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao Move Metrify Mind!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Verifique os dados e tente novamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
      });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      const updatedProfile = await authService.updateProfile(user.id, data);
      setProfile(updatedProfile);
      toast({
        title: "Perfil atualizado com sucesso",
        description: "Suas alterações foram salvas.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Tente novamente.",
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 