import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Sparkles, Search, Loader2, Eye } from 'lucide-react';
import { generateMessage } from '../../services/ai';
import { buildUserPrompt } from '../../services/aiPrompts';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import { useDraft } from '../../hooks/useDraft';
import { useWizardStep } from '../../services/wizardState';
import PreviewModal from '../PreviewModal';
import toast from 'react-hot-toast';

export default function LoveWizard({ onBack, recipient = 'amor', occasion }: { onBack: () => void, recipient?: string, occasion?: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useWizardStep(`draft_${recipient}`);
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft(`draft_${recipient}`, {
    myName: '',
    loveName: '',
    startDate: '',
    photos: [] as PhotoWithCaption[],
    music: '',
    message: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [acceptLgpd, setAcceptLgpd] = useState(false);

  const isFriend = recipient.includes('amig') || recipient.includes('outro') || recipient === 'familia';
  const title1 = isFriend ? "O seu nome" : "Qual o seu nome?";
  const isProposal = occasion === 'pedido-namoro';
  const step2Title = isProposal ? 'Desde quando se conhecem?' : 'Quando tudo começou?';
  const step2Desc = isProposal ? 'Quando vocês se conheceram?' : 'Escolha a data do início do namoro';



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
      // 1. Fazer upload de todas as fotos com legenda
      const photosData: PhotoData[] = await Promise.all(
        formData.photos.map(async (photo) => {
          if (!photo.file) return { url: '', caption: photo.caption };
          const url = await uploadPhoto(photo.file, user.id);
          return { url, caption: photo.caption };
        })
      );
      
      // 2. Salvar página no firestore
      const pageData = {
        name1: formData.myName,
        name2: formData.loveName,
        startDate: formData.startDate,
        music: formData.music,
        message: formData.message,
        photos: photosData.filter(p => p.url)
      };
      
      const pageId = await createPage(user.id, recipient, pageData);
      
      clearDraft();
      
      // 3. Navegar para a página de sucesso
      navigate('/success', { state: { pageId } });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error('Houve um erro ao salvar o presente. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const prompt = buildUserPrompt(occasion || 'historia-amor', {
        senderName: formData.myName,
        recipientName: formData.loveName,
        startDate: formData.startDate,
      });
      const generatedText = await generateMessage(prompt, occasion);
      setFormData(prev => ({ ...prev, message: generatedText }));
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
          <div className="text-sm font-semibold text-primary">Passo {step} de 4</div>
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-amber-400 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className="w-full max-w-lg glass rounded-[2rem] p-8 md:p-10 shadow-[0_0_30px_rgba(255,0,127,0.1)] border border-white/10 z-10 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Heart size={32} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold">Quem são vocês?</h2>
              </div>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={formData.myName}
                  onChange={e => setFormData({...formData, myName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl py-4 px-5 text-lg outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all text-center" 
                  placeholder={title1}
                />
                <div className="text-center text-rose-300 font-serif italic">&</div>
                <input 
                  type="text" 
                  value={formData.loveName}
                  onChange={e => setFormData({...formData, loveName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl py-4 px-5 text-lg outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all" 
                  placeholder="Ex: Maria" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">{step2Title}</h2>
                <p className="text-white/50 mt-2">{step2Desc}</p>
              </div>
              <div>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl py-4 px-5 text-lg outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all" 
                />
              </div>
              {formData.startDate && (
                <div className="p-4 bg-rose-50 text-primary rounded-2xl text-center font-medium animate-pulse">
                  {isProposal
                    ? `Vocês se conhecem desde ${new Date(formData.startDate).toLocaleDateString()} ❤️`
                    : `Vocês estão juntos desde ${new Date(formData.startDate).toLocaleDateString()} ❤️`}
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Fotos e Trilha Sonora</h2>
              </div>
              
              <div>
                <PhotoUploadWithCaption 
                  photos={formData.photos} 
                  onChange={(photos) => setFormData({...formData, photos})}
                  maxPhotos={10}
                  themeColor="rose"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-white/80 dark:text-white/70">Nossa Música</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-white/40" size={20} />
                  <input 
                    type="text" 
                    value={formData.music}
                    onChange={e => setFormData({...formData, music: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl py-3 pl-12 pr-5 outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all" 
                    placeholder="Colar Link do YouTube ou Nome da Música" 
                  />
                </div>
                <p className="text-[11px] text-white/50 dark:text-white/40 mt-2 ml-1">💡 Dica: Cole o link de um vídeo do YouTube para tocar a música inteira!</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Uma mensagem do coração</h2>
                <p className="text-white/50 mt-2">Escreva o que você sente (ou deixe a IA ajudar)</p>
              </div>

              <div className="flex justify-center mb-4">
                <button 
                  onClick={handleGenerateAI} 
                  disabled={isGenerating}
                  className="bg-rose-50 text-primary border border-rose-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isGenerating ? 'Escrevendo...' : 'Me ajude a escrever'}
                </button>
              </div>

              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-2xl p-5 text-lg outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all resize-none" 
                placeholder="Escreva sua declaração..." 
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
          
          <button onClick={() => setShowPreview(true)} title="Ver Prévia" className="p-4 rounded-2xl bg-white/5 border border-white/10 text-primary dark:text-rose-300 hover:bg-white/10 hover:text-white transition-colors">
            <Eye size={24} />
          </button>

          <button onClick={step === 4 ? handleFinish : nextStep} disabled={isSaving || (step === 1 && (!formData.myName || !formData.loveName)) || (step === 4 && !acceptLgpd)} className="flex-1 bg-primary text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={24} /> : step === 4 ? 'Gerar Presente' : 'Continuar'} 
            {!isSaving && step < 4 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>

      <PreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        pageData={{
          ...formData,
          name1: formData.myName,
          name2: formData.loveName,
          photos: formData.photos.map(p => ({ url: p.preview || '', caption: p.caption }))
        }} 
      />
    </div>
  );
}
