import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, UploadCloud, GraduationCap } from 'lucide-react';

export default function GraduationWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    message: '',
    photos: [] as File[],
    videos: [] as File[],
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
              <div className="border-2 border-dashed border-emerald-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-emerald-100/50 transition-colors">
                <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Toque para adicionar mídia</p>
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
          <button onClick={step === 3 ? handleFinish : nextStep} disabled={step === 1 && (!formData.name || !formData.course)} className="flex-1 bg-emerald-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-colors disabled:opacity-50">
            {step === 3 ? 'Gerar Presente' : 'Continuar'} 
            {step < 3 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
