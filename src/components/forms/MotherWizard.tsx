import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Sparkles, UploadCloud, Mic } from 'lucide-react';

export default function MotherWizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    photos: [] as File[],
    audio: null as File | null,
    video: null as File | null
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
      message: `Mãe, você é meu porto seguro. Obrigado por todo amor e dedicação. Tudo o que sou devo a você. Te amo infinitamente!`
    }));
  };

  return (
    <div className="min-h-screen bg-pink-50/50 dark:bg-slate-950 flex flex-col items-center pt-12 px-4 pb-20">
      
      {/* Step Indicator */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-semibold text-pink-500">Passo {step} de 3</div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-pink-100 dark:border-slate-800 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                  <Heart size={32} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold">Qual o nome da sua mãe?</h2>
              </div>
              <div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 text-lg outline-none focus:border-pink-400 focus:ring-4 ring-pink-100 transition-all text-center font-medium" 
                  placeholder="Ex: Dona Maria" 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Álbum e Voz</h2>
                <p className="text-slate-500 mt-2">Adicione memórias inesquecíveis</p>
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Fotos e Vídeos</label>
                <label className="block border-2 border-dashed border-pink-200 dark:border-slate-700 bg-pink-50/50 dark:bg-slate-800/50 rounded-3xl p-6 text-center cursor-pointer hover:bg-pink-100/50 transition-colors">
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => {
                    if (e.target.files) {
                      setFormData({...formData, photos: Array.from(e.target.files)});
                    }
                  }} />
                  <UploadCloud className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">Toque para adicionar fotos/vídeos</p>
                  {formData.photos.length > 0 && <p className="text-sm text-pink-500 mt-2">{formData.photos.length} arquivo(s) selecionado(s)</p>}
                </label>
              </div>

              <div>
                <label className="block font-medium mb-2 text-slate-700 dark:text-slate-300">Áudio Especial</label>
                <label className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({...formData, audio: e.target.files[0]});
                    }
                  }} />
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 flex-shrink-0">
                    <Mic size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Mensagem de Voz</p>
                    <p className="text-sm text-slate-500">{formData.audio ? formData.audio.name : 'Faça o upload do seu áudio'}</p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Carta para a Mãe</h2>
              </div>
              <div className="flex justify-center mb-4">
                <button onClick={generateAI} className="bg-pink-50 text-pink-600 border border-pink-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-pink-100 transition">
                  <Sparkles size={16} /> Me ajude a escrever
                </button>
              </div>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-lg outline-none focus:border-pink-400 focus:ring-4 ring-pink-100 transition-all resize-none" 
                placeholder="Escreva algo lindo para ela..." 
              />
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={step === 3 ? handleFinish : nextStep} disabled={step === 1 && !formData.name} className="flex-1 bg-pink-500 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-200 hover:bg-pink-600 transition-colors disabled:opacity-50">
            {step === 3 ? 'Gerar Presente' : 'Continuar'} 
            {step < 3 && <ChevronRight size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
}
