-- Adicionar coluna de plano premium na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN subscription_plan text DEFAULT 'free',
ADD COLUMN subscription_expires_at timestamp with time zone;

-- Criar trigger para atualizar timestamp de atualização
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();