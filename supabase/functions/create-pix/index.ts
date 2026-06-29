import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const PLANS = {
  lifetime: { amount: 99.90, title: "Premium Vitalício", description: "Presente Mágico - Acesso Vitalício" },
  monthly: { amount: 9.90, title: "Premium Mensal", description: "Presente Mágico - Premium Mensal" },
  annual: { amount: 49.90, title: "Premium Anual", description: "Presente Mágico - Premium Anual" },
} as const

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const body = await req.json().catch(() => ({}))
    const planType: string = body.plan_type || "lifetime"
    const plan = PLANS[planType as keyof typeof PLANS] || PLANS.lifetime

    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN")
    if (!accessToken) {
      throw new Error("Mercado Pago não configurado")
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://presentemagic.com.br"

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            id: planType,
            title: plan.title,
            description: plan.description,
            quantity: 1,
            currency_id: "BRL",
            unit_price: plan.amount,
          },
        ],
        payer: { email: user.email },
        back_urls: {
          success: `${siteUrl}/plans?status=success`,
          failure: `${siteUrl}/plans?status=failure`,
          pending: `${siteUrl}/plans?status=pending`,
        },
        auto_return: "approved",
        notification_url: `https://qpmpsozarwkbwkyhbhow.supabase.co/functions/v1/mercadopago-webhook`,
        external_reference: JSON.stringify({ user_id: user.id, plan_type: planType }),
      }),
    })

    if (!mpResponse.ok) {
      const err = await mpResponse.text()
      console.error("Erro Mercado Pago:", err)
      throw new Error("Falha ao criar preferência de pagamento")
    }

    const preference = await mpResponse.json()
    const initPoint = preference.init_point || preference.sandbox_init_point
    const preferenceId = preference.id

    const { error: insertError } = await supabaseClient
      .from("payment_requests")
      .insert({
        user_id: user.id,
        user_email: user.email,
        status: "pending",
        mercadopago_id: preferenceId,
        plan_type: planType,
      })

    if (insertError) {
      console.error("Erro ao salvar payment_request:", insertError)
    }

    return new Response(
      JSON.stringify({
        init_point: initPoint,
        preference_id: preferenceId,
        plan_type: planType,
        amount: plan.amount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Erro create-pix:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
