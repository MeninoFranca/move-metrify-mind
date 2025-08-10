-- Create Stripe subscriptions table for user subscription management
CREATE TABLE public.stripe_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_id TEXT NOT NULL,
  subscription_id TEXT,
  price_id TEXT,
  current_period_start INTEGER,
  current_period_end INTEGER,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  status TEXT DEFAULT 'not_started',
  subscription_status TEXT DEFAULT 'not_started',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own subscription" 
ON public.stripe_subscriptions 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own subscription" 
ON public.stripe_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own subscription" 
ON public.stripe_subscriptions 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create Stripe orders table for one-time payments
CREATE TABLE public.stripe_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checkout_session_id TEXT NOT NULL,
  payment_intent_id TEXT,
  customer_id TEXT NOT NULL,
  amount_subtotal INTEGER,
  amount_total INTEGER,
  currency TEXT,
  payment_status TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for orders
ALTER TABLE public.stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders (orders are typically admin-managed but users can view their own)
CREATE POLICY "Users can view orders with their customer_id" 
ON public.stripe_orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.stripe_subscriptions 
  WHERE stripe_subscriptions.customer_id = stripe_orders.customer_id 
  AND stripe_subscriptions.user_id::text = auth.uid()::text
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stripe_subscriptions_updated_at
BEFORE UPDATE ON public.stripe_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_orders_updated_at
BEFORE UPDATE ON public.stripe_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();