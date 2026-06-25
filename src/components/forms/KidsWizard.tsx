import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, UploadCloud, Smile } from 'lucide-react';

export default function KidsWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    date: '',
    photos: [] as File[]
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = () => navigate('/success', { state: { pageId: Math.random().toString(36).substring(2, 8) } });

  return (
    <div className="min-h-screen bg-yellow-50/50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-yellow-600">Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-yellow-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                  <Smile size={32} />
                </div>
                <h2 className="text-2xl font-bold">Quem vai comemorar?</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-yellow-400 focus:ring-4 ring-yellow-100 transition-all text-center font-medium" 
                  placeholder="Nome da Criança" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Tema e Data</h2>
              </div>
              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Tema da Festa</label>
                <input 
                  type="text" 
                  value={formData.theme}
                  onChange={e => setFormData({...formData, theme: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 outline-none focus:border-yellow-400 focus:ring-4 ring-yellow-100 transition-all" 
                  placeholder="Ex: Dinossauros, Princesas..." 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Data</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 outline-none focus:border-yellow-400 focus:ring-4 ring-yellow-100 transition-all" 
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Fotos Divertidas</h2>
              </div>
              <div className="border-2 border-dashed border-yellow-200 dark:border-slate-700 bg-yellow-50/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-yellow-100/50 transition-colors">
                <UploadCloud className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Toque para adicionar fotos da criança</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={step === 3 ? handleFinish : nextStep} disabled={step === 1 && !formData.name} className="flex-1 bg-yellow-400 text-slate-900 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-yellow-200 hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {step === 3 ? 'Gerar Convite' : 'Continuar'} 
            {step < 3 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
