import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { stripeProducts } from '@/stripe-config';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useStripe = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } else {
        setSubscription(data as SubscriptionData);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (priceId: string, mode: 'subscription' | 'payment' = 'subscription') => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: `${window.location.origin}/subscription/success`,
        cancel_url: `${window.location.origin}/subscription/cancel`,
        mode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  const getActiveSubscription = () => {
    if (!subscription || !subscription.price_id) return null;
    
    const product = stripeProducts.find(p => p.priceId === subscription.price_id);
    return product ? {
      ...product,
      status: subscription.subscription_status,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_method: subscription.payment_method_brand && subscription.payment_method_last4 
        ? `${subscription.payment_method_brand} ****${subscription.payment_method_last4}`
        : null
    } : null;
  };

  return {
    subscription,
    isLoading,
    createCheckoutSession,
    getActiveSubscription,
    refetch: fetchSubscription,
  };
};