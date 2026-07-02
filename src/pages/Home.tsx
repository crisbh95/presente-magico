import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Sparkles, Music, Star, CheckCircle2, Clock, LogOut, User as UserIcon, Flower2, Shield, Baby, Gem, HeartHandshake, Users, CreditCard, Mail, PencilLine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import OnboardingModal from '../components/OnboardingModal';
import heroBg from '../assets/hero.png';

const CARDS = [
  { id: 'amor', title: 'Amor', icon: Heart },
  { id: 'aniversario', title: 'Aniversário', icon: Gift },
  { id: 'mae', title: 'Mãe', icon: Flower2 },
  { id: 'pai', title: 'Pai', icon: Shield },
  { id: 'filho', title: 'Filho(a)', icon: Baby },
  { id: 'casamento', title: 'Casamento', icon: Gem },
  { id: 'avo', title: 'Avô(ó)', icon: HeartHandshake },
  { id: 'amigo', title: 'Amigo(a)', icon: Users },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [introStage, setIntroStage] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const s1 = setTimeout(() => setIntroStage(1), 1000); 
    const s2 = setTimeout(() => setIntroStage(2), 2500); 
    const s3 = setTimeout(() => setIntroStage(3), 4500); 
    const s4 = setTimeout(() => setIntroStage(4), 7000); 
    const s5 = setTimeout(() => setIntroFinished(true), 9000); 
    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); clearTimeout(s4); clearTimeout(s5); };
  }, []);

  const handleCardClick = (id: string) => {
    setSelectedCard(id);
    setTimeout(() => {
      navigate('/create', { state: { template: id } });
    }, 800);
  };

  return (
    <>
      {!introFinished ? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans">
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
                  <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_50px_20px_rgba(255,0,127,0.8)]" />
                ) : (
                  <Gift size={64} className="text-primary animate-pulse drop-shadow-[0_0_15px_rgba(255,0,127,0.8)]" />
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
                    {i % 3 === 0 ? <Heart size={24} className="text-primary" /> : i % 3 === 1 ? <Sparkles size={24} className="text-rose-400" /> : <Music size={24} className="text-purple-400" />}
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center z-20"
              >
                <img src="/logo.jpeg" alt="Presente Mágico" className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-6 border-4 border-primary shadow-[0_0_40px_rgba(255,0,127,0.6)]" />
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 tracking-tight">
                  PRESENTE MÁGICO
                </h1>
              </motion.div>
            </>
          )}
        </div>
      ) : (
        <div className="min-h-screen bg-black font-sans text-white overflow-x-hidden selection:bg-primary/30 selection:text-white">
          <Helmet>
            <title>Presente Mágico | Crie presentes inesquecíveis</title>
            <meta name="description" content="Crie páginas personalizadas com contador de tempo, música e fotos para presentear quem você ama." />
          </Helmet>
          
          <header className="fixed top-0 w-full bg-black/60 backdrop-blur-xl z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img src="/logo.jpeg" alt="Presente Mágico" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-[0_0_15px_rgba(255,0,127,0.5)] border border-primary/50 group-hover:scale-105 transition-all duration-300" />
                <span className="font-extrabold text-xl tracking-wide hidden sm:block group-hover:text-primary transition-all">
                  Presente <span className="text-primary">Mágico</span>
                </span>
              </Link>
              <nav className="hidden md:flex gap-6 items-center font-semibold text-sm text-white/70">
                <Link to="/create" className="hover:text-white transition">Criar</Link>
                <a href="#funcionalidades" className="hover:text-white transition">Funcionalidades</a>
                <a href="#precos" className="hover:text-white transition">Planos</a>
                
                <div className="w-px h-5 bg-white/20 mx-2" />
                
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-2 hover:text-white transition">
                      <UserIcon size={16} /> Painel
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-rose-500 hover:text-rose-400 transition" title="Sair">
                      <LogOut size={16} /> Sair
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="px-5 py-2.5 bg-primary/10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-bold shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                    Entrar
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <section id="criar" className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden flex min-h-[90vh] items-center">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none flex justify-end">
               <img src={heroBg} className="h-full w-full md:w-[60%] object-cover opacity-50 md:opacity-80" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)', maskImage: 'linear-gradient(to right, transparent, black 40%)' }} alt="Hero background" />
               <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent md:via-black/90 md:to-black/30"></div>
            </div>

            <div className="max-w-7xl mx-auto w-full z-10 grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6 text-center md:text-left"
              >
                <div className="py-2 px-6 border border-primary bg-primary/10 w-fit rounded-full mx-auto md:mx-0 shadow-[0_0_20px_-5px_rgba(255,0,127,0.5)]">
                  <div className="text-primary/90 text-sm font-semibold tracking-wide">❤️ Transforme memórias em emoção</div>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
                  Surpreenda com Amor:<br/>
                  <span className="text-primary font-extrabold neon-text">Crie uma Homenagem</span><br/>
                  Inesquecível ❤️
                </h1>
                
                <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto md:mx-0">
                  Crie uma linda animação com suas melhores memórias. Reviva momentos especiais e emocione quem você ama com uma página mágica e personalizada!
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                  <a href="#temas" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary/90 transition-all shadow-[0_0_25px_-5px_rgba(255,0,127,0.8)] flex justify-center items-center gap-2 hover:scale-[1.02]">
                    <Sparkles className="w-5 h-5" />
                    Criar Presente Agora
                  </a>
                  <div className="flex items-center gap-2 text-sm text-white/50 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Teste Grátis
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-8 justify-center md:justify-start">
                   <div className="flex -space-x-4">
                     <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                     <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                     <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                     <div className="w-12 h-12 rounded-full border-2 border-black bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">+10k</div>
                   </div>
                   <div className="text-sm text-white/70">
                     <div className="flex gap-1 text-primary"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                     <span className="font-semibold text-white">Mais de 10.000</span> pessoas já emocionaram
                   </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="hidden md:flex justify-center relative"
              >
                <img src="/mockup.jpg" alt="Presente Mágico Mockup" className="w-full max-w-md rounded-3xl shadow-[0_0_50px_-15px_rgba(255,0,127,0.5)] border border-primary/20 hover:scale-[1.02] transition-transform duration-500 object-cover" />
              </motion.div>
            </div>
          </section>

          <section id="temas" className="py-24 relative bg-black/50 border-y border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <div className="mb-16">
                 <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-2 text-sm text-primary font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                   <Heart className="w-4 h-4" /> Temas <Heart className="w-4 h-4" />
                 </span>
                 <h2 className="text-3xl md:text-5xl font-extrabold mt-6 mb-4 tracking-tight">
                   Escolha a Ocasião Perfeita
                 </h2>
                 <p className="text-lg text-white/50 max-w-2xl mx-auto">
                   Selecionamos layouts mágicos para cada tipo de amor.
                 </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-20">
                 {CARDS.map((card, i) => {
                   const Icon = card.icon;
                   const isSelected = selectedCard === card.id;
                   
                   return (
                     <motion.div
                       key={card.id}
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       animate={{ 
                         opacity: selectedCard && !isSelected ? 0 : 1,
                         scale: isSelected ? 3 : 1,
                         zIndex: isSelected ? 50 : 1
                       }}
                       transition={{ duration: isSelected ? 0.6 : 0.4, delay: i * 0.05 }}
                       onClick={() => !selectedCard && handleCardClick(card.id)}
                       className={`group cursor-pointer rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-white transition-all duration-300 hover:bg-primary/5 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_rgba(255,0,127,0.4)] flex flex-col items-center justify-center gap-4 ${selectedCard ? 'pointer-events-none' : ''}`}
                     >
                       <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_30px_-15px_rgba(255,0,127,0.5)] transition duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                         <Icon size={32} />
                       </div>
                       <h3 className="font-bold text-lg md:text-xl text-white/90 group-hover:text-white">{card.title}</h3>
                     </motion.div>
                   );
                 })}
               </div>
            </div>
          </section>

          <section id="funcionalidades" className="py-24 bg-black relative overflow-hidden border-b border-white/10">
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Tudo para Criar o <span className="text-primary neon-text">Presente Perfeito</span></h2>
                 <p className="text-lg text-white/50 max-w-2xl mx-auto">Mais que um QR Code. Uma experiência cinematográfica para quem você ama.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="group rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-8 transition duration-300 hover:bg-primary/5 hover:border-primary/40 hover:shadow-[0_0_30px_-15px_rgba(255,0,127,0.3)]">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_-15px_rgba(255,0,127,0.5)] transition duration-300 group-hover:bg-primary/20">
                    <Music size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Música de Fundo</h3>
                  <p className="text-sm leading-relaxed text-white/60">Crie a atmosfera perfeita adicionando a música tema do casal. Um player elegante tocará automaticamente.</p>
                </div>

                <div className="group rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-8 transition duration-300 hover:bg-primary/5 hover:border-primary/40 hover:shadow-[0_0_30px_-15px_rgba(255,0,127,0.3)]">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_-15px_rgba(255,0,127,0.5)] transition duration-300 group-hover:bg-primary/20">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Contador de Tempo</h3>
                  <p className="text-sm leading-relaxed text-white/60">O sistema calcula anos, meses, dias, horas, minutos e segundos exatos desde que a história de vocês começou.</p>
                </div>

                <div className="group rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-8 transition duration-300 hover:bg-primary/5 hover:border-primary/40 hover:shadow-[0_0_30px_-15px_rgba(255,0,127,0.3)]">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_-15px_rgba(255,0,127,0.5)] transition duration-300 group-hover:bg-primary/20">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">IA Ghostwriter</h3>
                  <p className="text-sm leading-relaxed text-white/60">Faltou palavras? Nossa Inteligência Artificial escreve cartas e declarações emocionantes baseadas em vocês.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 relative bg-black border-b border-white/10 overflow-hidden">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                 <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-2 text-sm text-primary font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                   <Heart className="w-4 h-4" /> Emoção Real <Heart className="w-4 h-4" />
                 </span>
                 <h2 className="text-3xl md:text-5xl font-extrabold mt-6 mb-4 tracking-tight">Galeria de <span className="text-primary neon-text">Emoções</span></h2>
                 <p className="text-lg text-white/50 max-w-2xl mx-auto">Momentos inesquecíveis criados com o Presente Mágico.</p>
               </div>
               
               <div className="grid md:grid-cols-2 gap-8 items-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                     <img src="/emocao.jpg" alt="Casal emocionado" className="rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(255,0,127,0.2)] w-full object-cover" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                     <img src="/galeria.jpg" alt="Passo a passo" className="rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(255,0,127,0.2)] w-full object-cover" />
                  </motion.div>
               </div>
             </div>
          </section>

          {/* Como Funciona Section */}
          <section className="py-24 relative bg-black/50 border-b border-white/10">
             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                 <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-2 text-sm text-primary font-bold tracking-wide shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                   <Heart className="w-4 h-4" /> Passo a Passo <Heart className="w-4 h-4" />
                 </span>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full">
                  <div className="flex-1 w-full max-w-[280px] flex flex-col items-center">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full flex flex-col items-center gap-6 relative hover:border-primary/40 transition-colors">
                        <div className="absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-extrabold text-xl shadow-[0_0_20px_rgba(255,0,127,0.6)]">1</div>
                        <PencilLine className="text-primary w-12 h-12 mt-4 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]" />
                        <div className="text-center">
                           <h3 className="font-bold text-xl mb-2 text-white">Preencha</h3>
                           <p className="text-sm text-white/50">Conte sua história e escolha fotos inesquecíveis.</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="hidden md:block w-16 h-[2px] bg-gradient-to-r from-primary to-transparent opacity-50 relative">
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary blur-[3px]"></div>
                  </div>

                  <div className="flex-1 w-full max-w-[280px] flex flex-col items-center">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full flex flex-col items-center gap-6 relative hover:border-primary/40 transition-colors">
                        <div className="absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-extrabold text-xl shadow-[0_0_20px_rgba(255,0,127,0.6)]">2</div>
                        <CreditCard className="text-primary w-12 h-12 mt-4 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]" />
                        <div className="text-center">
                           <h3 className="font-bold text-xl mb-2 text-white">Ative</h3>
                           <p className="text-sm text-white/50">Crie sua conta ou faça upgrade para premium.</p>
                        </div>
                     </div>
                  </div>

                  <div className="hidden md:block w-16 h-[2px] bg-gradient-to-r from-primary to-transparent opacity-50 relative">
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary blur-[3px]"></div>
                  </div>

                  <div className="flex-1 w-full max-w-[280px] flex flex-col items-center">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full flex flex-col items-center gap-6 relative hover:border-primary/40 transition-colors">
                        <div className="absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-extrabold text-xl shadow-[0_0_20px_rgba(255,0,127,0.6)]">3</div>
                        <Mail className="text-primary w-12 h-12 mt-4 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]" />
                        <div className="text-center">
                           <h3 className="font-bold text-xl mb-2 text-white">Surpreenda</h3>
                           <p className="text-sm text-white/50">Receba o QR Code mágico e emocione!</p>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          </section>

          {/* PLANOS */}
          <section id="precos" className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Planos <span className="text-primary neon-text">Mágicos</span></h2>
                <p className="text-lg text-white/50">Comece de graça, eternize para sempre.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Grátis */}
                <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-2xl font-bold mb-2 text-white">Essencial</h3>
                  <p className="text-white/50 mb-6">Ideal para conhecer a magia.</p>
                  <div className="text-5xl font-extrabold mb-8 text-white">R$ 0<span className="text-xl font-medium text-white/30">/mês</span></div>
                  <ul className="space-y-4 mb-8 text-white/80">
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> 1 Página ativa</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> Modelos Básicos</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> QR Code padrão</li>
                  </ul>
                  <button onClick={() => navigate('/create')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition text-white">Criar Grátis</button>
                </div>

                {/* Premium */}
                <div className="bg-primary/10 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border-2 border-primary relative shadow-[0_0_50px_-15px_rgba(255,0,127,0.4)] transform md:-translate-y-4">
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,127,0.5)]">
                    Premium
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Magia Infinita</h3>
                  <p className="text-primary mb-6 drop-shadow-[0_0_5px_rgba(255,0,127,0.5)]">Para memórias eternas.</p>
                  <div className="text-5xl font-extrabold mb-8 text-white">R$ 19,90<span className="text-xl font-medium text-white/50">/mês</span></div>
                  <ul className="space-y-4 mb-8 text-white/90">
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> Páginas ilimitadas</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> IA Ghostwriter Ilimitada</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> Contador de Tempo e Músicas</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-primary w-5 h-5" /> Download de QR Code em alta</li>
                  </ul>
                  <button onClick={() => user ? navigate('/plans') : navigate('/login')} className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition shadow-[0_0_20px_rgba(255,0,127,0.4)]">Assinar Premium</button>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-black py-12 text-center text-white/40 border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                   <img src="/logo.jpeg" className="w-8 h-8 rounded-full border border-white/20 grayscale opacity-50" />
                   <span className="font-bold text-white/50 tracking-wider">PRESENTE MÁGICO</span>
                </div>
                <p className="text-sm">&copy; {new Date().getFullYear()} Presente Mágico. Todos os direitos reservados.</p>
                <div className="flex gap-6 text-sm font-medium">
                  <Link to="/privacidade" className="hover:text-white transition">Privacidade</Link>
                  <Link to="/termos" className="hover:text-white transition">Termos</Link>
                  <Link to="/contato" className="hover:text-white transition">Contato</Link>
                </div>
              </div>
          </footer>
        </div>
      )}
      <OnboardingModal />
    </>
  );
}
