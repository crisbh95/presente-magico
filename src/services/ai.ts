import { supabase } from '../supabase/config';
import { getProfile } from './db';
import toast from 'react-hot-toast';

const FALLBACK_PHRASES = [
  "O amor verdadeiro transcende o tempo. Cada momento ao seu lado é um presente que guardarei para sempre no coração.",
  "Estar com você transforma qualquer lugar no melhor lugar do mundo. Te amo infinito!",
  "A vida é muito melhor dividida com você. Nossas memórias são meu maior tesouro.",
  "Sabe aquela sensação de lar? É assim que me sinto quando estou com você.",
  "Você é a minha melhor decisão, minha maior sorte e meu amor mais bonito.",
  "As palavras não alcançam o tamanho do sentimento que tenho por você. É de alma."
];

const PHOTO_FALLBACKS = [
  "Um momento perfeito capturado para a eternidade.",
  "Esse sorriso é tudo que eu preciso para alegrar meu dia.",
  "Uma memória que me faz transbordar de felicidade.",
  "O tempo para quando olho para essa lembrança.",
  "Guardado num potinho para não esquecer jamais.",
  "O amor mora nos pequenos detalhes, como este aqui."
];

export async function generateMessage(prompt: string): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await getProfile(session.user.id);
      if (profile?.plan === 'free') {
        toast.error("A Inteligência Artificial é exclusiva do plano Premium.");
        throw new Error("PREMIUM_REQUIRED");
      }
    }

    const { data, error } = await supabase.functions.invoke('generate-ai', {
      body: { prompt, type: 'message' }
    });

    if (error) throw error;
    if (data && data.result) return data.result;
    throw new Error("Sem resposta");
  } catch (error: any) {
    if (error.message === "PREMIUM_REQUIRED") throw error;
    console.error("Erro ao gerar mensagem na Edge Function:", error);
    return FALLBACK_PHRASES[Math.floor(Math.random() * FALLBACK_PHRASES.length)];
  }
}

export async function generatePhotoCaption(context: string = ''): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await getProfile(session.user.id);
      if (profile?.plan === 'free') {
        toast.error("A Inteligência Artificial é exclusiva do plano Premium.");
        throw new Error("PREMIUM_REQUIRED");
      }
    }

    const prompt = "Gere uma legenda carinhosa e criativa para uma foto especial " + context;
    const { data, error } = await supabase.functions.invoke('generate-ai', {
      body: { prompt, type: 'caption' }
    });

    if (error) throw error;
    if (data && data.result) return data.result.replace(/['"]/g, '');
    throw new Error("Sem resposta");
  } catch (error: any) {
    if (error.message === "PREMIUM_REQUIRED") throw error;
    console.error("Erro ao gerar legenda na Edge Function:", error);
    return PHOTO_FALLBACKS[Math.floor(Math.random() * PHOTO_FALLBACKS.length)];
  }
}
