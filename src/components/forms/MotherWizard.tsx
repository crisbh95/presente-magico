import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Sparkles, Mic, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import { generateMessage } from '../../services/ai';
import { buildUserPrompt } from '../../services/aiPrompts';
import { useDraft } from '../../hooks/useDraft';
import { useWizardStep } from '../../services/wizardState';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import PreviewModal from '../PreviewModal';
import toast from 'react-hot-toast';

export default function MotherWizard({ onBack, recipient = 'mae', occasion }: { onBack: () => void, recipient?: string, occasion?: string }) {
  const navigate = useNavigate();
  const [step, setStep] = useWizardStep(`draft_${recipient}`);
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft(`draft_${recipient}`, {
    name: '',
    message: '',
    photos: [] as PhotoWithCaption[],
    audio: null as File | null,
    video: null as File | null
  });

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [acceptLgpd, setAcceptLgpd] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isAvo = recipient === 'avo-f' || recipient.includes('avo');
  const titleText = isAvo ? "Qual o nome da sua avó?" : "Qual o nome da sua mãe?";

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = async () => {
    if (!user) {
      localStorage.setItem('pendingCreate', JSON.stringify({ recipient, draftKey: `draft_${recipient}`, timestamp: Date.now() }));
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
      
      const pageId = await createPage(user.id, recipient, pageData);
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
      const occ = occasion || (isAvo ? 'homenagem-avo-f' : 'dia-maes');
      const prompt = buildUserPrompt(occ, { name: formData.name });
      const text = await generateMessage(prompt, occ);
      setFormData(prev => ({ ...prev, message: text }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center pt-12 px-4 pb-20 relative overflow-hidden">
      
      
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
{/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-pink-500">Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-pink-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-amber-400 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-pink-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                  <Heart size={32} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold">{titleText}</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl py-4 px-5 text-lg outline-none focus:border-pink-400 focus:ring-4 ring-pink-100 transition-all text-center font-medium" 
                  placeholder="Ex: Dona Maria" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Álbum e Voz</h2>
                <p className="text-white/50 mt-2">Adicione memórias inesquecíveis</p>
              </div>

              <div>
                <label className="block font-medium mb-2 text-white/80 dark:text-white/70">Fotos e Vídeos</label>
                <PhotoUploadWithCaption 
                  photos={formData.photos} 
                  onChange={(photos) => setFormData({...formData, photos})}
                  maxPhotos={10}
                  themeColor="pink"
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
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 flex-shrink-0">
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
                <h2 className="text-2xl font-bold">Carta para a Mãe</h2>
              </div>
              <div className="flex justify-center mb-4">
                <button onClick={generateAI} disabled={isGenerating} className="bg-pink-50 text-pink-600 border border-pink-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-pink-100 transition disabled:opacity-50">
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isGenerating ? 'Escrevendo...' : 'Me ajude a escrever'}
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl p-5 text-lg outline-none focus:border-pink-400 focus:ring-4 ring-pink-100 transition-all resize-none" 
                placeholder="Escreva algo lindo para ela..." 
              />
            </motion.div>
          )}

        </AnimatePresence>

        {step === 4 && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
            <input
              type="checkbox"
              id="lgpd"
              checked={acceptLgpd}
              onChange={(e) => setAcceptLgpd(e.target.checked)}
              className="mt-1 min-w-4 w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-black/50 accent-primary"
            />
            <label htmlFor="lgpd" className="text-xs text-white/70 leading-relaxed">
              Autorizo o processamento dos dados e fotos fornecidos estritamente para a criação e exibição deste presente, conforme a <a href="/privacidade" target="_blank" className="text-primary hover:underline">Política de Privacidade (LGPD)</a>.
            </label>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 dark:text-white/70 hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <button onClick={() => setShowPreview(true)} title="Ver Prévia" className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 hover:bg-pink-100 transition-colors">
            <Eye size={24} />
          </button>

          <button onClick={step === 3 ? handleFinish : nextStep} disabled={isSaving || (step === 1 && !formData.name)} className="flex-1 bg-pink-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-200 hover:bg-pink-600 transition-colors disabled:opacity-50">
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
          name1: formData.name, // compatibility
          photos: formData.photos.map(p => ({ url: p.preview || '', caption: p.caption }))
        }} 
      />
    </div>
  );
}
