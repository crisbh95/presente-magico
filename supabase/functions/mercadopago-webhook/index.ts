import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const PLAN_DURATIONS: Record<string, number | null> = {
  agency: 30,
  monthly: 30,
  annual: 365,
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log("Webhook recebido:", JSON.stringify(body))

    const action = body.action
    if (action !== "payment.created" && action !== "payment.updated") {
      return new Response(JSON.stringify({ message: "Ignorado" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const mpPaymentId = String(body.data?.id)
    if (!mpPaymentId) {
      throw new Error("ID do pagamento não encontrado no webhook")
    }

    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN")
    if (!accessToken) {
      throw new Error("Mercado Pago não configurado")
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${mpPaymentId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!mpResponse.ok) {
      const err = await mpResponse.text()
      console.error("Erro ao buscar pagamento:", err)
      throw new Error("Falha ao consultar pagamento")
    }

    const payment = await mpResponse.json()

    if (payment.status !== "approved") {
      return new Response(
        JSON.stringify({ message: `Status: ${payment.status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const payerEmail = payment.payer?.email
    if (!payerEmail) {
      throw new Error("Email do pagador não encontrado")
    }

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (!serviceRoleKey) {
      throw new Error("Service Role Key não configurada")
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      serviceRoleKey
    )

    const { data: paymentReq } = await supabaseAdmin
      .from("payment_requests")
      .select("plan_type, user_id")
      .eq("mercadopago_id", mpPaymentId)
      .maybeSingle()

    const planType = paymentReq?.plan_type || "lifetime"
    const durationDays = PLAN_DURATIONS[planType] ?? null

    const updateData: Record<string, unknown> = { plan: "premium", plan_type: planType }
    if (durationDays !== null) {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + durationDays)
      updateData.subscription_end = endDate.toISOString()
    }

    const { error: profError } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("email", payerEmail)

    if (profError) {
      console.error("Erro ao atualizar perfil:", profError)
      throw new Error("Erro ao atualizar perfil")
    }

    const userId = paymentReq?.user_id
    if (userId) {
      const { error: reqError } = await supabaseAdmin
        .from("payment_requests")
        .upsert({
          user_id: userId,
          user_email: payerEmail,
          status: "approved",
          mercadopago_id: mpPaymentId,
          plan_type: planType,
        }, { onConflict: "mercadopago_id", ignoreDuplicates: false })

      if (reqError) {
        console.error("Erro ao salvar payment_request:", reqError)
      }
    }

    console.log(`Pagamento ${mpPaymentId} aprovado para ${payerEmail} (${planType})`)

    return new Response(
      JSON.stringify({ message: "Premium ativado com sucesso!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Erro webhook:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
