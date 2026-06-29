import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, MessageCircle, ArrowRight, X } from 'lucide-react';

const slides = [
  {
    icon: <Heart className="w-16 h-16 text-rose-500" fill="currentColor" />,
    title: 'Alguém especial merece algo especial',
    subtitle: 'Crie presentes digitais únicos que tocam o coração',
    color: 'bg-rose-50 dark:bg-rose-950',
  },
  {
    icon: <Music className="w-16 h-16 text-indigo-500" />,
    title: 'Fotos + Música + Palavras = ❤️',
    subtitle: 'Combine tudo em uma experiência emocionante e inesquecível',
    color: 'bg-indigo-50 dark:bg-indigo-950',
  },
  {
    icon: <MessageCircle className="w-16 h-16 text-emerald-500" />,
    title: 'Em 5 minutos você cria magia',
    subtitle: 'Simples, rápido, e o resultado é de emocionar qualquer um',
    color: 'bg-emerald-50 dark:bg-emerald-950',
  },
];

export default function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('onboardingSeen');
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('onboardingSeen', 'true');
    setShow(false);
  };

  const next = () => {
    if (slide < slides.length - 1) setSlide(s => s + 1);
    else dismiss();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`w-full max-w-sm rounded-[2rem] p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl ${slides[slide].color}`}
          >
            <button onClick={dismiss} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-black/5 transition-colors">
              <X size={20} />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white/80 dark:bg-slate-900/80 rounded-full flex items-center justify-center shadow-lg">
                {slides[slide].icon}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold mb-3 text-slate-800 dark:text-slate-100">
              {slides[slide].title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
              {slides[slide].subtitle}
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === slide ? 'w-8 bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              {slide < slides.length - 1 ? 'Continuar' : 'Começar'}
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
