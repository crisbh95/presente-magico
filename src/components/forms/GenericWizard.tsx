import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Mic, Loader2, Eye, Heart, Gift, HandHeart, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import { generateMessage } from '../../services/ai';
import { buildUserPrompt } from '../../services/aiPrompts';
import { useDraft } from '../../hooks/useDraft';
import { useWizardStep } from '../../services/wizardState';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import PreviewModal from '../PreviewModal';
import toast from 'react-hot-toast';

// Configuração dinâmica por ocasião
const OCCASION_CONFIG: Record<string, {
  title: string;
  placeholder: string;
  messageTitle: string;
  messagePlaceholder: string;
  aiMessage: string;
  icon: 'heart' | 'gift' | 'handHeart' | 'star';
  color: string;
}> = {
  'agradecimento': {
    title: 'Para quem é o agradecimento?',
    placeholder: 'Ex: João',
    messageTitle: 'Sua Mensagem de Gratidão',
    messagePlaceholder: 'Escreva suas palavras de agradecimento...',
    aiMessage: 'Quero te agradecer do fundo do coração por tudo que você fez e faz por mim. Você é uma pessoa incrível e sou muito grato por ter você na minha vida. Obrigado por cada gesto de carinho!',
    icon: 'handHeart',
    color: 'amber',
  },
  'desculpas': {
    title: 'Para quem é o pedido de desculpas?',
    placeholder: 'Ex: Maria',
    messageTitle: 'Suas Palavras',
    messagePlaceholder: 'Escreva o que está no seu coração...',
    aiMessage: 'Sei que errei e que minhas palavras talvez não sejam suficientes, mas preciso que você saiba o quanto sinto muito. Você é muito importante pra mim e farei de tudo para reconquistar sua confiança. Me perdoa?',
    icon: 'heart',
    color: 'rose',
  },
  'comemoracao': {
    title: 'Quem você quer homenagear?',
    placeholder: 'Ex: Carlos',
    messageTitle: 'Sua Mensagem Especial',
    messagePlaceholder: 'Escreva algo especial para essa pessoa...',
    aiMessage: 'Hoje é um dia muito especial e eu não poderia deixar de celebrar com você! Você merece todo o reconhecimento do mundo. Parabéns por essa conquista!',
    icon: 'star',
    color: 'violet',
  },
  'aposentadoria': {
    title: 'Quem está se aposentando?',
    placeholder: 'Ex: Seu José',
    messageTitle: 'Sua Homenagem',
    messagePlaceholder: 'Escreva uma homenagem especial...',
    aiMessage: 'Chegou o momento de celebrar uma vida inteira de dedicação e trabalho. Você é um exemplo de força e determinação. Agora é hora de aproveitar cada segundo! Parabéns pela aposentadoria!',
    icon: 'gift',
    color: 'emerald',
  },
  'personalizado': {
    title: 'Para quem é este presente?',
    placeholder: 'Ex: Ana',
    messageTitle: 'Sua Mensagem',
    messagePlaceholder: 'Escreva o que quiser...',
    aiMessage: 'Você é uma pessoa muito especial na minha vida. Cada momento ao seu lado é único e inesquecível. Obrigado por existir e fazer parte da minha história!',
    icon: 'star',
    color: 'purple',
  },
};

const DEFAULT_CONFIG = OCCASION_CONFIG['personalizado'];

const COLOR_CLASSES: Record<string, {
  pageBg: string;
  text: string;
  bg: string;
  iconBg: string;
  border: string;
  focusInput: string;
  aiBtn: string;
  aiBtnHover: string;
  prevBtn: string;
  primaryBtn: string;
  primaryBtnText: string;
  primaryBtnHover: string;
  shadow: string;
  step: string;
}> = {
  amber: {
    pageBg: 'bg-amber-50/30 dark:bg-slate-950',
    text: 'text-primary',
    bg: 'bg-primary',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-100 dark:border-slate-800',
    focusInput: 'focus:border-primary focus:ring-4 ring-primary/20',
    aiBtn: 'bg-white/5 border border-white/10 text-primary dark:text-amber-300 border-amber-200 dark:border-amber-800',
    aiBtnHover: 'hover:bg-white/10 hover:text-white',
    prevBtn: 'bg-white/5 border border-white/10 text-primary dark:text-amber-300',
    primaryBtn: 'bg-primary',
    primaryBtnText: 'text-white',
    primaryBtnHover: 'hover:bg-primary/90',
    shadow: 'shadow-[0_0_15px_rgba(255,0,127,0.4)] dark:shadow-none',
    step: 'bg-primary',
  },
  rose: {
    pageBg: 'bg-rose-50/30 dark:bg-slate-950',
    text: 'text-primary',
    bg: 'bg-primary',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    border: 'border-rose-100 dark:border-slate-800',
    focusInput: 'focus:border-primary focus:ring-4 ring-primary/20',
    aiBtn: 'bg-white/5 border border-white/10 text-primary dark:text-rose-300 border-rose-200 dark:border-rose-800',
    aiBtnHover: 'hover:bg-white/10 hover:text-white',
    prevBtn: 'bg-white/5 border border-white/10 text-primary dark:text-rose-300',
    primaryBtn: 'bg-primary',
    primaryBtnText: 'text-white',
    primaryBtnHover: 'hover:bg-primary/90',
    shadow: 'shadow-[0_0_15px_rgba(255,0,127,0.4)] dark:shadow-none',
    step: 'bg-primary',
  },
  violet: {
    pageBg: 'bg-violet-50/30 dark:bg-slate-950',
    text: 'text-violet-500',
    bg: 'bg-violet-500',
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    border: 'border-violet-100 dark:border-slate-800',
    focusInput: 'focus:border-violet-400 focus:ring-4 ring-violet-100',
    aiBtn: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    aiBtnHover: 'hover:bg-violet-100',
    prevBtn: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300',
    primaryBtn: 'bg-violet-500',
    primaryBtnText: 'text-white',
    primaryBtnHover: 'hover:bg-violet-600',
    shadow: 'shadow-xl shadow-violet-200 dark:shadow-none',
    step: 'bg-violet-500',
  },
  emerald: {
    pageBg: 'bg-emerald-50/30 dark:bg-slate-950',
    text: 'text-primary',
    bg: 'bg-primary',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-100 dark:border-slate-800',
    focusInput: 'focus:border-primary focus:ring-4 ring-primary/20',
    aiBtn: 'bg-white/5 border border-white/10 text-primary dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    aiBtnHover: 'hover:bg-white/10 hover:text-white',
    prevBtn: 'bg-white/5 border border-white/10 text-primary dark:text-emerald-300',
    primaryBtn: 'bg-primary',
    primaryBtnText: 'text-white',
    primaryBtnHover: 'hover:bg-primary/90',
    shadow: 'shadow-[0_0_15px_rgba(255,0,127,0.4)] dark:shadow-none',
    step: 'bg-primary',
  },
  purple: {
    pageBg: 'bg-purple-50/30 dark:bg-slate-950',
    text: 'text-primary',
    bg: 'bg-primary',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-100 dark:border-slate-800',
    focusInput: 'focus:border-primary focus:ring-4 ring-primary/20',
    aiBtn: 'bg-white/5 border border-white/10 text-primary dark:text-purple-300 border-purple-200 dark:border-purple-800',
    aiBtnHover: 'hover:bg-white/10 hover:text-white',
    prevBtn: 'bg-white/5 border border-white/10 text-primary dark:text-purple-300',
    primaryBtn: 'bg-primary',
    primaryBtnText: 'text-white',
    primaryBtnHover: 'hover:bg-primary/90',
    shadow: 'shadow-[0_0_15px_rgba(255,0,127,0.4)] dark:shadow-none',
    step: 'bg-primary',
  },
};

export default function GenericWizard({ onBack, occasion = 'personalizado', recipient = 'outro' }: { onBack: () => void, occasion?: string, recipient?: string }) {
  const navigate = useNavigate();
  const draftKey = `draft_generic_${occasion}`;
  const [step, setStep] = useWizardStep(draftKey);
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft(draftKey, {
    name: '',
    message: '',
    photos: [] as PhotoWithCaption[],
    audio: null as File | null,
  });

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const config = OCCASION_CONFIG[occasion] || DEFAULT_CONFIG;
  const c = config.color === 'amber' || config.color === 'rose' || config.color === 'violet' || config.color === 'emerald' ? config.color : 'purple';
  const cls = COLOR_CLASSES[c];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = async () => {
    if (!user) {
      localStorage.setItem('pendingCreate', JSON.stringify({ recipient, draftKey, timestamp: Date.now() }));
      navigate('/login', { state: { from: { pathname: '/create' }, message: 'Falta pouco! Crie sua conta grátis para salvar seu presente e receber o link.' } });
      return;
    }
    setIsSaving(true);
    try {
      const photosData: PhotoData[] = await Promise.all(
        formData.photos.map(async (photo) => {
          if (!photo.file) return { url: '', caption: photo.caption };
          const url = await uploadPhoto(photo.file, user.id);
          return { url, caption: photo.caption };
        })
      );
      
      let audioUrl = '';
      if (formData.audio) {
        audioUrl = await uploadPhoto(formData.audio, user.id);
      }
      
      const pageData = {
        name: formData.name,
        message: formData.message,
        photos: photosData.filter(p => p.url),
        audio: audioUrl
      };
      
      const pageId = await createPage(user.id, occasion, pageData);
      clearDraft();
      navigate('/success', { state: { pageId } });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error('Houve um erro ao salvar o presente. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const generateAI = async () => {
    setIsGenerating(true);
    try {
      const prompt = buildUserPrompt(occasion, { name: formData.name });
      const text = await generateMessage(prompt, occasion);
      setFormData(prev => ({ ...prev, message: text }));
    } finally {
      setIsGenerating(false);
    }
  };

  const IconComponent = config.icon === 'heart' ? Heart : config.icon === 'gift' ? Gift : config.icon === 'handHeart' ? HandHeart : Star;

  return (
    <div className={`min-h-screen ${cls.pageBg} flex flex-col items-center pt-12 px-4 pb-20`}>
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className={`text-sm font-semibold ${cls.text}`}>Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? cls.step : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-amber-400 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className={`w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl ${cls.border} relative overflow-hidden`}>
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${cls.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 ${cls.text}`}>
                  <IconComponent size={32} />
                </div>
                <h2 className="text-2xl font-bold">{config.title}</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={`w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl py-4 px-5 text-lg outline-none ${cls.focusInput} transition-all text-center font-medium`} 
                  placeholder={config.placeholder} 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Álbum e Voz</h2>
                <p className="text-white/50 mt-2">Adicione fotos e áudio especial</p>
              </div>

              <div>
                <label className="block font-medium mb-2 text-white/80 dark:text-white/70">Fotos e Vídeos</label>
                <PhotoUploadWithCaption 
                  photos={formData.photos} 
                  onChange={(photos) => setFormData({...formData, photos})}
                  maxPhotos={10}
                  themeColor={c}
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-white/80 dark:text-white/70">Áudio Especial</label>
                <label className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({...formData, audio: e.target.files[0]});
                    }
                  }} />
                  <div className={`w-12 h-12 ${cls.iconBg} rounded-full flex items-center justify-center ${cls.text} flex-shrink-0`}>
                    <Mic size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Mensagem de Voz</p>
                    <p className="text-sm text-white/50">{formData.audio ? formData.audio.name : 'Faça o upload do seu áudio'}</p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{config.messageTitle}</h2>
              </div>
              <div className="flex justify-center mb-4">
                <button onClick={generateAI} disabled={isGenerating} className={`${cls.aiBtn} rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 ${cls.aiBtnHover} transition disabled:opacity-50`}>
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isGenerating ? 'Escrevendo...' : 'Me ajude a escrever'}
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className={`w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl p-5 text-lg outline-none ${cls.focusInput} transition-all resize-none`} 
                placeholder={config.messagePlaceholder} 
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 dark:text-white/70 hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <button onClick={() => setShowPreview(true)} title="Ver Prévia" className={`p-4 rounded-2xl ${cls.prevBtn} ${cls.aiBtnHover} transition-colors`}>
            <Eye size={24} />
          </button>

          <button onClick={step === 3 ? handleFinish : nextStep} disabled={isSaving || (step === 1 && !formData.name)} className={`flex-1 ${cls.primaryBtn} ${cls.primaryBtnText} rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 ${cls.shadow} ${cls.primaryBtnHover} transition-colors disabled:opacity-50`}>
            {isSaving ? <Loader2 className="animate-spin" size={24} /> : step === 3 ? 'Gerar Presente' : 'Continuar'} 
            {!isSaving && step < 3 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>

      <PreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        pageData={{
          ...formData,
          name1: formData.name,
          photos: formData.photos.map(p => ({ url: p.preview || '', caption: p.caption }))
        }} 
      />
    </div>
  );
}
