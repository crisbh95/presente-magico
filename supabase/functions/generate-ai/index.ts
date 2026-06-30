import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from './cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SYSTEM_INSTRUCTION = `
Você é um ghostwriter emocional e empático da plataforma 'Presente Mágico'.
Sua missão é ajudar os usuários a escreverem homenagens, cartas e memórias curtas e impactantes.
O tom deve ser sempre afetuoso, humano e adequado para a ocasião pedida.
Responda APENAS com o texto final gerado, sem aspas, sem introduções ("Aqui está:") e sem explicações.
Escreva de forma natural, como se fosse a pessoa falando.
O tamanho ideal é de 2 a 4 parágrafos curtos.
`;

const CAPTION_SYSTEM_INSTRUCTION = "Você é um assistente criativo. Crie uma pequena legenda romântica ou afetuosa para uma foto. Deve ter no máximo 2 frases. Seja poético, mas natural. NUNCA repita frases se for chamado várias vezes. Varie o tom. Responda APENAS a legenda, sem aspas.";

Deno.serve(async (req) => {
  // Tratamento de preflight CORS (OPÇÕES)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar autenticação do usuário (Segurança contra bots)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Processar o corpo da requisição
    const { prompt, type = 'message', systemPrompt } = await req.json();

    const apiKey = Deno.env.get('QWEN_API_KEY') || Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("Chave da IA não configurada no Edge Function Secrets");
    }

    const baseURL = Deno.env.get('QWEN_BASE_URL') || 'https://openrouter.ai/api/v1/chat/completions';
    const modelName = Deno.env.get('QWEN_MODEL') || 'qwen/qwen-2.5-72b-instruct';

    // Usar systemPrompt personalizado se fornecido, senão usar o padrão
    const systemContext = systemPrompt || (type === 'caption' ? CAPTION_SYSTEM_INSTRUCTION : SYSTEM_INSTRUCTION);

    // Chamada à IA
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://presentemagico.com', // Altere para seu domínio real
        'X-Title': 'Presente Mágico'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: type === 'caption' ? 100 : 500
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro na API do OpenRouter: ${err}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ result: resultText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Erro no Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
