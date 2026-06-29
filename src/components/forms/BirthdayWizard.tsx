import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Gift, Sparkles, Search, Cake, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPage, uploadPhoto, type PhotoData } from '../../services/db';
import PhotoUploadWithCaption, { type PhotoWithCaption } from './PhotoUploadWithCaption';
import PreviewModal from '../PreviewModal';
import { useDraft } from '../../hooks/useDraft';
import toast from 'react-hot-toast';

export default function BirthdayWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const { data: formData, setData: setFormData, hasRestored, clearDraft } = useDraft('draft_aniversario', {
    name: '',
    age: '',
    date: '',
    photos: [] as PhotoWithCaption[],
    music: '',
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
      localStorage.setItem('pendingCreate', JSON.stringify({recipient: 'outro', draftKey: 'draft_aniversario', timestamp: Date.now() }));
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
        name1: formData.name,
        age: formData.age,
        date: formData.date,
        music: formData.music,
        message: formData.message,
        photos: photosData.filter(p => p.url)
      };
      
      const pageId = await createPage(user.id, 'aniversario', pageData);
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
      message: `Feliz Aniversário, ${formData.name}! Que a vida continue te surpreendendo e que este novo ciclo de ${formData.age} anos seja repleto de amor, paz e muitas conquistas. Você merece o mundo!`
    }));
  };

  return (
    <div className="min-h-screen bg-indigo-50/50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-indigo-500">Passo {step} de 4</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {hasRestored && (
        <div className="w-full max-w-lg mb-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl text-sm flex items-center justify-between border border-yellow-200 dark:border-yellow-900/50">
          <span>Rascunho recuperado.</span>
          <button onClick={() => { clearDraft(); window.location.reload(); }} className="underline font-semibold">Limpar</button>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-indigo-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                  <Gift size={32} />
                </div>
                <h2 className="text-2xl font-bold">Quem é o aniversariante?</h2>
              </div>
              <div>
                <label className="block font-medium mb-2">Nome da pessoa</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100 transition-all" 
                  placeholder="Ex: Carlos" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                  <Cake size={32} />
                </div>
                <h2 className="text-2xl font-bold">Qual idade está completando?</h2>
              </div>
              <div>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100 transition-all text-center text-3xl font-bold" 
                  placeholder="Ex: 30" 
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Fotos e Música de Festa</h2>
              </div>
              
              <PhotoUploadWithCaption
                photos={formData.photos}
                onChange={(photos) => setFormData({ ...formData, photos })}
                maxPhotos={6}
              />

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Trilha Sonora Animada</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={formData.music}
                    onChange={e => setFormData({...formData, music: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-5 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100 transition-all" 
                    placeholder="Buscar música (Ex: Parabéns da Xuxa)" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Uma mensagem de Feliz Aniversário</h2>
                <p className="text-slate-500 mt-2">Deseje tudo de bom!</p>
              </div>

              <div className="flex justify-center mb-4">
                <button onClick={generateAI} className="bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-indigo-100 transition">
                  <Sparkles size={16} /> Gerar mensagem com IA
                </button>
              </div>

              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100 transition-all resize-none" 
                placeholder="Escreva seus parabéns..." 
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
            onClick={step === 4 ? handleFinish : nextStep}
            disabled={
              (step === 1 && !formData.name) ||
              (step === 2 && !formData.age) ||
              isSaving
            }
            className="flex-1 bg-indigo-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:shadow-none"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : step === 4 ? 'Gerar Presente' : 'Continuar'} 
            {step < 4 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pageData={{
          recipient: 'aniversario',
          name1: formData.name,
          age: formData.age,
          date: formData.date,
          music: formData.music,
          message: formData.message,
          photos: formData.photos
        }}
      />
    </div>
  );
}
