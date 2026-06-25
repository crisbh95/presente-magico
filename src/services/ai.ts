import { GoogleGenerativeAI } from '@google/generative-ai';

// Instância do Gemini (Inicializa apenas se tiver a chave)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Template base de sistema para o assistente
const SYSTEM_INSTRUCTION = `
Você é um ghostwriter emocional e empático da plataforma 'Presente Mágico'.
Sua missão é ajudar os usuários a escreverem homenagens, cartas e memórias curtas e impactantes.
O tom deve ser sempre afetuoso, humano e adequado para a ocasião pedida.
Responda APENAS com o texto final gerado, sem aspas, sem introduções ("Aqui está:") e sem explicações.
Escreva de forma natural, como se fosse a pessoa falando.
O tamanho ideal é de 2 a 4 parágrafos curtos.
`;

export async function generateMessage(prompt: string): Promise<string> {
  if (!genAI) {
    console.warn("Chave do Gemini não configurada (VITE_GEMINI_API_KEY). Retornando mensagem de fallback.");
    return "O amor verdadeiro transcende o tempo. Cada momento ao seu lado é um presente que guardarei para sempre no coração. (Configure a chave do Gemini no arquivo .env.local para gerar mensagens com IA!)";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro ao gerar mensagem com Gemini:", error);
    return "Não foi possível gerar a mensagem no momento. Por favor, tente escrever algo com suas próprias palavras! ❤️";
  }
}
