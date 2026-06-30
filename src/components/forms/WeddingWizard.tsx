import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Sparkles, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import PreviewModal from '../PreviewModal';

import { useDraft } from '../../hooks/useDraft';
import { useWizardStep } from '../../services/wizardState';
import toast from 'react-hot-toast';

export default function WeddingWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useWizardStep('draft_casamento');
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft('draft_casamento', {
    name1: '',
    name2: '',
    date: '',
    address: '',
    time: '',
    message: '',
    photos: [] as PhotoWithCaption[]
  });

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = async () => {
    if (!user) {
      localStorage.setItem('pendingCreate', JSON.stringify({recipient: 'amor', draftKey: 'draft_casamento', timestamp: Date.now() }));
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
      
      const pageData = {
        name1: formData.name1,
        name2: formData.name2,
        date: formData.date,
        address: formData.address,
        time: formData.time,
        message: formData.message,
        photos: photosData.filter(p => p.url)
      };
      
      const pageId = await createPage(user.id, 'casamento', pageData);
      clearDraft();
      navigate('/success', { state: { pageId } });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error('Houve um erro ao salvar o presente. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-stone-500">Passo {step} de 4</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-stone-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-rose-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-serif">Os Noivos</h2>
              </div>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={formData.name1}
                  onChange={e => setFormData({...formData, name1: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-stone-400 focus:ring-4 ring-stone-100 transition-all text-center" 
                  placeholder="Nome 1" 
                />
                <div className="text-center text-stone-400 font-serif italic">&</div>
                <input 
                  type="text" 
                  value={formData.name2}
                  onChange={e => setFormData({...formData, name2: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-stone-400 focus:ring-4 ring-stone-100 transition-all text-center" 
                  placeholder="Nome 2" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-serif">O Grande Dia</h2>
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Data e Horário</label>
                <div className="flex gap-4">
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 outline-none focus:border-stone-400 focus:ring-4 ring-stone-100 transition-all" 
                  />
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 outline-none focus:border-stone-400 focus:ring-4 ring-stone-100 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Endereço / Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-5 outline-none focus:border-stone-400 focus:ring-4 ring-stone-100 transition-all" 
                    placeholder="Onde será a cerimônia?" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-serif">Ensaio dos Noivos</h2>
              </div>
              <div>
                <PhotoUploadWithCaption 
                  photos={formData.photos} 
                  onChange={(photos) => setFormData({...formData, photos})}
                  maxPhotos={10}
                  themeColor="stone"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-serif">O Convite</h2>
              </div>
              <div className="flex justify-center mb-4">
                <button onClick={() => setFormData(p => ({...p, message: 'Com a bênção de nossos pais, convidamos você para celebrar nossa união e o início de uma nova família.'}))} className="bg-stone-100 text-stone-600 border border-stone-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-stone-200 transition">
                  <Sparkles size={16} /> Sugestão Clássica
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-stone-400 focus:ring-4 ring-stone-100 transition-all resize-none" 
                placeholder="Escreva a mensagem do convite..." 
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <button onClick={() => setShowPreview(true)} title="Ver Prévia" className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/30 text-stone-600 dark:text-stone-300 hover:bg-stone-100 transition-colors">
            <Eye size={24} />
          </button>

          <button onClick={step === 4 ? handleFinish : nextStep} disabled={isSaving || (step === 1 && (!formData.name1 || !formData.name2))} className="flex-1 bg-stone-800 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-stone-200 hover:bg-stone-700 transition-colors disabled:opacity-50">
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
          photos: formData.photos.map(p => ({ url: p.preview || '', caption: p.caption }))
        }} 
      />
    </div>
  );
}
