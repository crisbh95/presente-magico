import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Mic, Loader2, Eye, Heart, Gift, HandHeart, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
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

  const config = OCCASION_CONFIG[occasion] || DEFAULT_CONFIG;
  const colorMap: Record<string, string> = {
    amber: 'amber',
    rose: 'rose',
    violet: 'violet',
    emerald: 'emerald',
    purple: 'purple',
  };
  const c = colorMap[config.color] || 'purple';

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

  const generateAI = () => {
    setFormData(prev => ({
      ...prev,
      message: config.aiMessage
    }));
  };

  const IconComponent = config.icon === 'heart' ? Heart : config.icon === 'gift' ? Gift : config.icon === 'handHeart' ? HandHeart : Star;

  return (
    <div className={`min-h-screen bg-${c}-50/30 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20`}>
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className={`text-sm font-semibold text-${c}-500`}>Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? `bg-${c}-500` : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className={`w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-${c}-100 dark:border-slate-800 relative overflow-hidden`}>
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-${c}-100 dark:bg-${c}-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-${c}-500`}>
                  <IconComponent size={32} />
                </div>
                <h2 className="text-2xl font-bold">{config.title}</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-${c}-400 focus:ring-4 ring-${c}-100 transition-all text-center font-medium`} 
                  placeholder={config.placeholder} 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Álbum e Voz</h2>
                <p className="text-slate-500 mt-2">Adicione fotos e áudio especial</p>
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Fotos e Vídeos</label>
                <PhotoUploadWithCaption 
                  photos={formData.photos} 
                  onChange={(photos) => setFormData({...formData, photos})}
                  maxPhotos={10}
                  themeColor={c}
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Áudio Especial</label>
                <label className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({...formData, audio: e.target.files[0]});
                    }
                  }} />
                  <div className={`w-12 h-12 bg-${c}-100 dark:bg-${c}-900/30 rounded-full flex items-center justify-center text-${c}-500 flex-shrink-0`}>
                    <Mic size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Mensagem de Voz</p>
                    <p className="text-sm text-slate-500">{formData.audio ? formData.audio.name : 'Faça o upload do seu áudio'}</p>
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
                <button onClick={generateAI} className={`bg-${c}-50 dark:bg-${c}-900/30 text-${c}-600 dark:text-${c}-300 border border-${c}-200 dark:border-${c}-800 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-${c}-100 transition`}>
                  <Sparkles size={16} /> Me ajude a escrever
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-${c}-400 focus:ring-4 ring-${c}-100 transition-all resize-none`} 
                placeholder={config.messagePlaceholder} 
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <button onClick={() => setShowPreview(true)} title="Ver Prévia" className={`p-4 rounded-2xl bg-${c}-50 dark:bg-${c}-900/30 text-${c}-600 dark:text-${c}-300 hover:bg-${c}-100 transition-colors`}>
            <Eye size={24} />
          </button>

          <button onClick={step === 3 ? handleFinish : nextStep} disabled={isSaving || (step === 1 && !formData.name)} className={`flex-1 bg-${c}-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-${c}-200 dark:shadow-none hover:bg-${c}-600 transition-colors disabled:opacity-50`}>
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
