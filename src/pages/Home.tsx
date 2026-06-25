import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Sparkles, Music, Camera, Star, CheckCircle2, Clock, Smartphone } from 'lucide-react';

const CARDS = [
  { id: 'amor', title: 'Amor', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'aniversario', title: 'Aniversário', icon: Gift, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'mae', title: 'Mãe', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'pai', title: 'Pai', icon: Star, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
];

export default function Home() {
  const navigate = useNavigate();
  const [introStage, setIntroStage] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Controle da animação cinematográfica
  useEffect(() => {
    const s1 = setTimeout(() => setIntroStage(1), 1000); // Aparece a luz
    const s2 = setTimeout(() => setIntroStage(2), 2500); // Vira caixa
    const s3 = setTimeout(() => setIntroStage(3), 4500); // Texto "Algumas lembranças..."
    const s4 = setTimeout(() => setIntroStage(4), 7000); // Partículas e Logo
    const s5 = setTimeout(() => setIntroFinished(true), 9000); // Mostra o site real
    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); clearTimeout(s4); clearTimeout(s5); };
  }, []);

  const handleCardClick = (id: string) => {
    setSelectedCard(id);
    setTimeout(() => {
      navigate('/create', { state: { template: id } });
    }, 800);
  };

  // Se o intro não terminou, mostra apenas a animação
  if (!introFinished) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <AnimatePresence>
          {introStage >= 1 && introStage < 4 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: introStage >= 2 ? 1.5 : 1, opacity: 1 }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute z-10"
            >
              {introStage === 1 ? (
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_50px_20px_rgba(255,255,255,0.8)]" />
              ) : (
                <Gift size={64} className="text-white animate-pulse" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {introStage === 3 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="text-white text-xl md:text-3xl font-serif mt-32 text-center px-4 absolute z-20"
            >
              "Algumas lembranças merecem viver para sempre..."
            </motion.p>
          )}
        </AnimatePresence>

        {introStage >= 4 && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * window.innerWidth,
                    y: (Math.random() - 0.5) * window.innerHeight,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute"
                >
                  {i % 3 === 0 ? <Heart size={24} className="text-rose-500" /> : i % 3 === 1 ? <Sparkles size={24} className="text-amber-400" /> : <Music size={24} className="text-purple-400" />}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500 tracking-tight"
            >
              PRESENTE MÁGICO
            </motion.h1>
          </>
        )}
      </div>
    );
  }

  // O SITE REAL: Landing Page Completa + Cards
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* Header Simples */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600">
            Presente Mágico
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-slate-600 dark:text-slate-300">
            <a href="#criar" className="hover:text-primary transition">Criar</a>
            <a href="#funcionalidades" className="hover:text-primary transition">Funcionalidades</a>
            <a href="#precos" className="hover:text-primary transition">Planos</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION: Os Cartões */}
      <section id="criar" className="pt-32 pb-20 px-4 md:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
              Que presente você deseja <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">criar hoje?</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Selecione um tema abaixo para começar a criar sua página mágica. Você receberá um QR Code para presentear quem você ama.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-20 perspective-[1000px]">
            {CARDS.map((card, i) => {
              const Icon = card.icon;
              const isSelected = selectedCard === card.id;
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: selectedCard && !isSelected ? 0 : 1,
                    y: 0,
                    scale: isSelected ? 5 : 1,
                    zIndex: isSelected ? 50 : 1
                  }}
                  whileHover={!selectedCard ? { scale: 1.05, rotateY: 10, rotateX: -10 } : {}}
                  transition={{ duration: isSelected ? 0.8 : 0.4, delay: !selectedCard ? i * 0.1 : 0 }}
                  onClick={() => !selectedCard && handleCardClick(card.id)}
                  className={`cursor-pointer ${card.bg} dark:bg-slate-900 border ${card.border} dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 shadow-xl hover:shadow-2xl transition-shadow ${selectedCard ? 'pointer-events-none' : ''}`}
                >
                  <div className={`p-4 rounded-full bg-white dark:bg-slate-800 shadow-sm ${card.color}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-slate-800 dark:text-slate-100">{card.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOVIDADE: Funcionalidades Inéditas */}
      <section id="funcionalidades" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Mais que um QR Code. Uma Experiência.</h2>
            <p className="text-xl text-slate-500">Tudo o que você precisa para emocionar, reunido em uma única página.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-[-2deg] border-8 border-white dark:border-slate-800 z-10 relative">
                <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop" alt="Casal feliz na polaróide" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-rose-100 dark:bg-rose-900 p-6 rounded-3xl shadow-xl rotate-[5deg] z-20 flex flex-col items-center">
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-300">365</span>
                <span className="text-sm font-semibold text-rose-500 uppercase">Dias Juntos</span>
              </div>
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Contador de Tempo ao Vivo</h3>
                  <p className="text-slate-500">O sistema calcula anos, meses, dias, horas, minutos e segundos desde a data especial de vocês, girando em tempo real na tela.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Music size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Música Ambiente Flutuante</h3>
                  <p className="text-slate-500">A sua página terá a música do casal tocando no fundo com um player elegante, transformando a leitura em uma cena de cinema.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">IA Ghostwriter Integrada</h3>
                  <p className="text-slate-500">Faltou palavras? Nossa Inteligência Artificial escreve cartas e mensagens incrivelmente emocionantes baseadas nos seus nomes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Como Funciona?</h2>
            <p className="text-xl text-slate-500">Crie seu presente em 3 passos simples.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Escolha o Tema</h3>
              <p className="text-slate-500">Amor, aniversário, homenagem aos pais... Temos um layout mágico para cada ocasião.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">Personalize</h3>
              <p className="text-slate-500">Adicione fotos, datas, cartas e escolha uma música marcante para o fundo.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Surpreenda</h3>
              <p className="text-slate-500">Você recebe um QR Code lindo. Imprima, coloque no presente físico e veja a magia acontecer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS E PREÇOS */}
      <section id="precos" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-white">Planos e Preços</h2>
            <p className="text-xl text-slate-400">Comece de graça, emocione para sempre.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Grátis */}
            <div className="bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-2">Momento Grátis</h3>
              <p className="text-slate-400 mb-6">Ideal para conhecer a magia.</p>
              <div className="text-5xl font-extrabold mb-8">R$ 0<span className="text-xl font-medium text-slate-500">/mês</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" /> 1 Página ativa</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" /> Modelos Básicos</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" /> QR Code padrão</li>
              </ul>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full py-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold transition">Criar Agora</button>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-rose-500 to-purple-600 p-8 md:p-10 rounded-3xl border border-white/20 relative shadow-2xl shadow-purple-500/20 transform md:-translate-y-4">
              <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-amber-400 text-amber-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Magia Premium</h3>
              <p className="text-rose-100 mb-6">Para memórias infinitas.</p>
              <div className="text-5xl font-extrabold mb-8 text-white">R$ 19<span className="text-xl font-medium text-rose-200">/mês</span></div>
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-white" /> Páginas ilimitadas</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-white" /> IA Ghostwriter Ilimitada</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-white" /> Contador de Tempo e Músicas</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-white" /> Download de QR Code em SVG</li>
              </ul>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full py-4 rounded-xl bg-white text-purple-600 hover:bg-slate-50 font-bold transition">Assinar Premium</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 text-center text-slate-500 border-t border-slate-800">
        <p>© 2026 Presente Mágico. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}
