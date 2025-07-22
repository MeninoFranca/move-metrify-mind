import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessGoal?: 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'increase_endurance';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  availableEquipment?: ('full_gym' | 'dumbbells' | 'bodyweight' | 'resistance_bands' | 'none')[];
  weeklyAvailability?: {
    [key: string]: {
      available: boolean;
      hours: number;
    };
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      console.log('Iniciando processo de registro...');
      console.log('Dados recebidos:', { email: data.email, ...data });

      // 1. Criar o usuário no Auth
      console.log('Criando usuário na autenticação...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (authError) {
        console.error('Erro na criação do usuário:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('Usuário não foi criado');
        throw new Error('Falha ao criar usuário');
      }

      console.log('Usuário criado com sucesso:', authData.user.id);

      // 2. Criar o perfil do usuário
      // Nota: O perfil é criado automaticamente pelo trigger handle_new_user
      // Vamos apenas atualizar com os dados adicionais
      console.log('Atualizando perfil do usuário...');
      
      const profileUpdateData = {
        full_name: data.fullName,
        age: data.age || null,
        weight: data.weight || null,
        height: data.height || null,
        fitness_goal: data.fitnessGoal || null,
        experience_level: data.experienceLevel || null,
        available_equipment: data.availableEquipment || null,
        weekly_availability: data.weeklyAvailability || null,
        updated_at: new Date().toISOString()
      };

      console.log('Dados do perfil a serem atualizados:', profileUpdateData);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('user_id', authData.user.id)
        .select()
        .single();

      if (profileError) {
        console.error('Erro na atualização do perfil:', profileError);
        console.error('Detalhes do erro:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        throw profileError;
      }

      console.log('Perfil atualizado com sucesso:', profileData);

      // 3. Configurações do usuário são criadas automaticamente pelo trigger
      console.log('Processo de registro concluído com sucesso');

      return authData;
    } catch (error) {
      console.error('Erro detalhado no registro:', error);
      throw error;
    }
  },

  async signIn({ email, password }: SignInData) {
    try {
      console.log('Iniciando processo de login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }

      console.log('Login realizado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao sair:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Perfil não encontrado para o usuário:', userId);
          return null;
        }
        console.error('Erro ao obter perfil:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return null;
    }
  },

  async updateProfile(userId: string, profile: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event as 'SIGNED_IN' | 'SIGNED_OUT', session);
    });
  }
}; 