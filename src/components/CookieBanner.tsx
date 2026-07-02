import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lgpd_cookie_consent');
    if (!consent) {
      // Pequeno atraso para aparecer suavemente
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('lgpd_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto glass border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_0_30px_rgba(255,0,127,0.15)] pointer-events-auto relative overflow-hidden bg-[#0a0a0a]/90 backdrop-blur-xl">
            {/* Efeito de neon no topo do banner */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-primary md:hidden" />
                  Nós valorizamos sua privacidade
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência em nosso site, 
                  personalizar conteúdos e proteger seus dados conforme a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. 
                  Ao continuar navegando, você concorda com nossos{' '}
                  <Link to="/terms" className="text-primary hover:text-primary/80 underline underline-offset-2">Termos de Uso</Link> e{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 underline underline-offset-2">Política de Privacidade</Link>.
                </p>
              </div>
              
              <div className="flex w-full md:w-auto items-center gap-3 shrink-0 mt-2 md:mt-0">
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 md:hidden absolute top-4 right-4 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={acceptCookies}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                >
                  Entendi e Aceito
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
