import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Smile, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import PreviewModal from '../PreviewModal';
import { useDraft } from '../../hooks/useDraft';
import toast from 'react-hot-toast';

export default function KidsWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft('draft_infantil', {
    name: '',
    theme: '',
    date: '',
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
      localStorage.setItem('pendingCreate', JSON.stringify({recipient: 'filho', draftKey: 'draft_infantil', timestamp: Date.now() }));
      navigate('/login', { state: { from: { pathname: '/create' } } });
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
        theme: formData.theme,
        date: formData.date,
        photos: photosData.filter(p => p.url)
      };
      
      const pageId = await createPage(user.id, 'infantil', pageData);
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
    <div className="min-h-screen bg-cyan-50/50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-cyan-500">Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-cyan-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-500">
                  <Smile size={32} />
                </div>
                <h2 className="text-2xl font-bold">Alegria de Criança</h2>
              </div>
              <div>
                <label className="block font-medium mb-2">Qual o nome da criança?</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-cyan-400 focus:ring-4 ring-cyan-100 transition-all" 
                  placeholder="Ex: Pedrinho" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Mundo Mágico</h2>
                <p className="text-slate-500 mt-2">Personalize o presente.</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Tema favorito (Opcional)</label>
                <input 
                  type="text" 
                  value={formData.theme}
                  onChange={e => setFormData({...formData, theme: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-cyan-400 focus:ring-4 ring-cyan-100 transition-all" 
                  placeholder="Ex: Dinossauros, Fadas..." 
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Data Especial (Opcional)</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-cyan-400 focus:ring-4 ring-cyan-100 transition-all" 
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Momentos Felizes</h2>
              </div>
              
              <PhotoUploadWithCaption
                photos={formData.photos}
                onChange={(photos) => setFormData({ ...formData, photos })}
                maxPhotos={6}
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={prevStep}
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={() => setShowPreview(true)}
            disabled={!formData.name}
            className="flex-1 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Eye size={20} /> Preview
          </button>

          <button 
            onClick={step === 3 ? handleFinish : nextStep}
            disabled={
              (step === 1 && !formData.name) ||
              isSaving
            }
            className="flex-1 bg-cyan-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-cyan-200 hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:shadow-none"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : step === 3 ? 'Gerar Presente' : 'Continuar'} 
            {step < 3 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pageData={{
          recipient: 'infantil',
          name1: formData.name,
          theme: formData.theme,
          date: formData.date,
          photos: formData.photos
        }}
      />
    </div>
  );
}
