import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Feather, Sparkles, UploadCloud } from 'lucide-react';

export default function MemorialWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    photos: [] as File[],
    messages: []
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = () => navigate('/success', { state: { pageId: Math.random().toString(36).substring(2, 8) } });

  const generateAI = () => {
    setFormData(prev => ({
      ...prev,
      bio: `Uma pessoa incrível que tocou a vida de muitos. Sua luz, alegria e bondade jamais serão esquecidas. Deixou um legado de amor que viverá para sempre em nossos corações.`
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-slate-500">Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-slate-400' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <Feather size={32} />
                </div>
                <h2 className="text-2xl font-bold">Em memória de quem?</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-slate-400 focus:ring-4 ring-slate-100 transition-all text-center font-medium" 
                  placeholder="Nome do homenageado" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Mural de Lembranças</h2>
              </div>
              <div>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">Toque para adicionar fotos e vídeos</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Biografia / Homenagem</h2>
              </div>
              <div className="flex justify-center mb-4">
                <button onClick={generateAI} className="bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-slate-200 transition">
                  <Sparkles size={16} /> Auxílio IA
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-slate-400 focus:ring-4 ring-slate-100 transition-all resize-none" 
                placeholder="Escreva sobre a vida e o legado..." 
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={step === 3 ? handleFinish : nextStep} disabled={step === 1 && !formData.name} className="flex-1 bg-slate-800 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50">
            {step === 3 ? 'Gerar Memorial' : 'Continuar'} 
            {step < 3 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
