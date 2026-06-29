import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, GraduationCap, Sparkles, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import PreviewModal from '../PreviewModal';

import { useDraft } from '../../hooks/useDraft';
import toast from 'react-hot-toast';

export default function GraduationWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft('draft_formatura', {
    name: '',
    course: '',
    date: '',
    photos: [] as PhotoWithCaption[],
    message: ''
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
      localStorage.setItem('pendingCreate', JSON.stringify({recipient: 'outro', draftKey: 'draft_formatura', timestamp: Date.now() }));
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
        name: formData.name,
        course: formData.course,
        date: formData.date,
        message: formData.message,
        photos: photosData.filter(p => p.url)
      };
      
      const pageId = await createPage(user.id, 'formatura', pageData);
      
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
      message: `Todo esforço valeu a pena! Parabéns pela formatura. Que esta conquista seja apenas o início de uma jornada brilhante e cheia de sucesso. O mundo é seu!`
    }));
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-emerald-600">Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-emerald-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <GraduationCap size={32} />
                </div>
                <h2 className="text-2xl font-bold">O Formando</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-emerald-400 focus:ring-4 ring-emerald-100 transition-all text-center font-medium mb-4" 
                  placeholder="Nome do formando" 
                />
                <input 
                  type="text" 
                  value={formData.course}
                  onChange={e => setFormData({...formData, course: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-emerald-400 focus:ring-4 ring-emerald-100 transition-all text-center font-medium" 
                  placeholder="Qual o curso? (Ex: Medicina)" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Conquistas</h2>
                <p className="text-slate-500 mt-2">Adicione fotos e vídeos dessa jornada</p>
              </div>
              <div>
                <PhotoUploadWithCaption 
                  photos={formData.photos} 
                  onChange={(photos) => setFormData({...formData, photos})}
                  maxPhotos={10}
                  themeColor="emerald"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Mensagem de Sucesso</h2>
              </div>
              <div className="flex justify-center mb-4">
                <button onClick={generateAI} className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-emerald-100 transition">
                  <Sparkles size={16} /> Me ajude a escrever
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-emerald-400 focus:ring-4 ring-emerald-100 transition-all resize-none" 
                placeholder="Deixe uma mensagem inspiradora..." 
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <button onClick={() => setShowPreview(true)} title="Ver Prévia" className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 transition-colors">
            <Eye size={24} />
          </button>

          <button onClick={step === 3 ? handleFinish : nextStep} disabled={isSaving || (step === 1 && (!formData.name || !formData.course))} className="flex-1 bg-emerald-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-colors disabled:opacity-50">
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
