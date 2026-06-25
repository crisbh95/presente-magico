import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Sparkles, UploadCloud, Search, Loader2 } from 'lucide-react';
import { generateMessage } from '../../services/ai';

export default function LoveWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    myName: '',
    loveName: '',
    startDate: '',
    photos: [] as File[],
    music: '',
    message: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const handleFinish = () => {
    navigate('/success', { state: { pageId: Math.random().toString(36).substring(2, 8) } });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Escreva uma carta de amor curta e muito emocionante para o casal ${formData.myName || 'meu amor'} e ${formData.loveName || 'amor'}. Destaque que estão juntos desde ${formData.startDate || 'sempre'}.`;
      const generatedText = await generateMessage(prompt);
      setFormData(prev => ({ ...prev, message: generatedText }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-rose-500">Passo {step} de 4</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-rose-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <Heart fill="currentColor" size={32} />
                </div>
                <h2 className="text-2xl font-bold">Como vocês se chamam?</h2>
              </div>
              <div>
                <label className="block font-medium mb-2">Seu nome</label>
                <input 
                  type="text" 
                  value={formData.myName}
                  onChange={e => setFormData({...formData, myName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-rose-400 focus:ring-4 ring-rose-100 transition-all" 
                  placeholder="Ex: João" 
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Nome do amor</label>
                <input 
                  type="text" 
                  value={formData.loveName}
                  onChange={e => setFormData({...formData, loveName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-rose-400 focus:ring-4 ring-rose-100 transition-all" 
                  placeholder="Ex: Maria" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Quando tudo começou?</h2>
                <p className="text-slate-500 mt-2">Escolha a data do início do namoro</p>
              </div>
              <div>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-rose-400 focus:ring-4 ring-rose-100 transition-all" 
                />
              </div>
              {formData.startDate && (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-center font-medium animate-pulse">
                  Vocês estão juntos desde {new Date(formData.startDate).toLocaleDateString()} ❤️
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
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">As fotos mais marcantes (até 10)</label>
                <label className="block border-2 border-dashed border-rose-200 dark:border-slate-700 bg-rose-50/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-rose-100/50 transition-colors">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files) {
                      setFormData({...formData, photos: Array.from(e.target.files)});
                    }
                  }} />
                  <UploadCloud className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">Toque ou arraste as fotos aqui</p>
                  <p className="text-xs text-slate-500 mt-2">JPEG, PNG ou HEIC até 10MB</p>
                  {formData.photos.length > 0 && <p className="text-sm text-rose-500 mt-2 font-semibold">{formData.photos.length} foto(s) selecionada(s)</p>}
                </label>
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Nossa Música</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={formData.music}
                    onChange={e => setFormData({...formData, music: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-5 outline-none focus:border-rose-400 focus:ring-4 ring-rose-100 transition-all" 
                    placeholder="Buscar música (Ex: Perfect Ed Sheeran)" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Uma mensagem do coração</h2>
                <p className="text-slate-500 mt-2">Escreva o que você sente (ou deixe a IA ajudar)</p>
              </div>

              <div className="flex justify-center mb-4">
                <button 
                  onClick={handleGenerateAI} 
                  disabled={isGenerating}
                  className="bg-rose-50 text-rose-600 border border-rose-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-rose-100 transition disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isGenerating ? 'Escrevendo...' : 'Me ajude a escrever'}
                </button>
              </div>

              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-rose-400 focus:ring-4 ring-rose-100 transition-all resize-none" 
                placeholder="Escreva sua declaração..." 
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
              (step === 1 && (!formData.myName || !formData.loveName)) ||
              (step === 2 && !formData.startDate)
            }
            className="flex-1 bg-rose-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-rose-200 hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:shadow-none"
          >
            {step === 4 ? 'Criar Presente Mágico' : 'Continuar'} 
            {step < 4 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
