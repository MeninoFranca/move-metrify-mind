import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { planProducts } from '@/stripe-config';

export type SubscriptionPlan = 'free' | 'pro' | 'premium';

interface UserSubscription {
  plan: SubscriptionPlan;
  expiresAt?: Date;
  isActive: boolean;
}

export const useSubscription = () => {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>({ plan: 'free', isActive: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      const plan = (profile.subscription_plan as SubscriptionPlan) || 'free';
      const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : undefined;
      const isActive = plan !== 'free' && (!expiresAt || expiresAt > new Date());
      
      setSubscription({ plan, expiresAt, isActive });
    }
    setIsLoading(false);
  }, [profile]);

  const subscribeToPlan = (planType: 'pro' | 'premium') => {
    const product = planProducts.find(p => p.planType === planType);
    if (product) {
      window.open(product.checkoutUrl, '_blank');
    }
  };

  const activateSubscription = async (planType: 'pro' | 'premium', durationDays = 30) => {
    if (!user) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planType,
          subscription_expires_at: expiresAt.toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSubscription({
        plan: planType,
        expiresAt,
        isActive: true
      });
    } catch (error) {
      console.error('Error activating subscription:', error);
      throw error;
    }
  };

  const verifyPayment = async (transactionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('tribopay-verify', {
        body: { transactionId }
      });

      if (error) throw error;

      if (data.success) {
        // Update local state
        const expiresAt = new Date(data.expiresAt);
        setSubscription({
          plan: data.plan,
          expiresAt,
          isActive: true
        });
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const hasFeatureAccess = (feature: 'basic' | 'pro' | 'premium') => {
    if (!subscription.isActive) return feature === 'basic';
    
    switch (feature) {
      case 'basic':
        return true;
      case 'pro':
        return subscription.plan === 'pro' || subscription.plan === 'premium';
      case 'premium':
        return subscription.plan === 'premium';
      default:
        return false;
    }
  };

  return {
    subscription,
    isLoading,
    subscribeToPlan,
    activateSubscription,
    verifyPayment,
    hasFeatureAccess,
  };
};