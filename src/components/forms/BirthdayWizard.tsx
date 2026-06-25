import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Gift, Sparkles, UploadCloud, Search, Cake } from 'lucide-react';

export default function BirthdayWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    photos: [] as File[],
    music: '',
    message: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = () => {
    navigate('/success', { state: { pageId: Math.random().toString(36).substring(2, 8) } });
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
              
              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">As fotos mais divertidas</label>
                <div className="border-2 border-dashed border-indigo-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-indigo-100/50 transition-colors">
                  <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">Toque ou arraste as fotos aqui</p>
                </div>
              </div>

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
            onClick={step === 4 ? handleFinish : nextStep}
            disabled={
              (step === 1 && !formData.name) ||
              (step === 2 && !formData.age)
            }
            className="flex-1 bg-indigo-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:shadow-none"
          >
            {step === 4 ? 'Gerar Presente' : 'Continuar'} 
            {step < 4 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
