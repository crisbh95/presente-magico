import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Calendar, UploadCloud, MapPin, Sparkles } from 'lucide-react';

export default function WeddingWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name1: '',
    name2: '',
    date: '',
    time: '',
    address: '',
    photos: [] as File[],
    message: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = () => navigate('/success', { state: { pageId: Math.random().toString(36).substring(2, 8) } });

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

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-stone-100 dark:border-slate-800 relative overflow-hidden">
        
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
              <div className="border-2 border-dashed border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-stone-100/50 transition-colors">
                <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Toque para adicionar fotos</p>
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
          <button onClick={step === 4 ? handleFinish : nextStep} disabled={step === 1 && (!formData.name1 || !formData.name2)} className="flex-1 bg-stone-800 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-stone-200 hover:bg-stone-700 transition-colors disabled:opacity-50">
            {step === 4 ? 'Gerar Convite' : 'Continuar'} 
            {step < 4 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
