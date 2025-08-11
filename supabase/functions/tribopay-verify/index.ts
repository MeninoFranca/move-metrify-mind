import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { transactionId } = await req.json();
    if (!transactionId) {
      throw new Error("Transaction ID required");
    }

    console.log(`Verifying payment for transaction: ${transactionId}`);

    // Verify payment with TriboPay API
    const tribopayToken = Deno.env.get("TRIBOPAY_API_TOKEN");
    if (!tribopayToken) {
      throw new Error("TriboPay API token not configured");
    }

    const response = await fetch(`https://api.tribopay.com.br/v1/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${tribopayToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TriboPay API error: ${response.status}`);
    }

    const paymentData = await response.json();
    console.log('Payment verification response:', paymentData);

    // Check if payment is completed
    if (paymentData.status === 'paid' || paymentData.status === 'completed') {
      // Determine plan type based on amount or product
      let planType: 'pro' | 'premium' = 'pro';
      
      // Assuming different amounts for different plans
      if (paymentData.amount >= 4900) { // R$ 49.00 or more = premium
        planType = 'premium';
      }

      // Set subscription expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Update user profile
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          subscription_plan: planType,
          subscription_expires_at: expiresAt.toISOString()
        })
        .eq('user_id', userData.user.id);

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      console.log(`Successfully activated ${planType} plan for user ${userData.user.id}`);

      return new Response(JSON.stringify({
        success: true,
        plan: planType,
        expiresAt: expiresAt.toISOString(),
        message: `Plano ${planType} ativado com sucesso!`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        status: paymentData.status,
        message: 'Pagamento ainda não foi processado'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});