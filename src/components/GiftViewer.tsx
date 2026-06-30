import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Music, Loader2, Gift, Calendar, MapPin, MessageCircle, Heart, Flag, GraduationCap, Flower2, Shield, Baby, Gem, HeartHandshake, Users, Star, Feather, PawPrint } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Contador Dinâmico Exato (Estilo Glassmorphism Escuro)
function LoveCounter({ startDate }: { startDate: string }) {
  const [time, setTime] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  const [showTotal, setShowTotal] = useState(true);

  useEffect(() => {
    const start = new Date(startDate).getTime();
    if (isNaN(start)) return;

    const updateCounter = () => {
      const now = new Date().getTime();
      const diff = now - start;
      if (diff < 0) return;

      const totalSeconds = Math.floor(diff / 1000);
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.44);
      const days = Math.floor((totalDays % 365.25) % 30.44);
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ years, months, days, hours, minutes, seconds, totalSeconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTotal(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[120px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showTotal ? (
          <motion.div key="total" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
            <p className="text-rose-400 font-serif text-sm italic mb-2">❤️ Há exatamente</p>
            <p className="text-white text-3xl font-serif font-bold tracking-widest drop-shadow-md">
              {time.totalSeconds.toLocaleString('pt-BR')}
            </p>
            <p className="text-white/70 text-xs tracking-[0.2em] uppercase mt-2">segundos que esta história começou...</p>
          </motion.div>
        ) : (
          <motion.div key="counter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full">
            <div className="flex justify-center gap-3 w-full max-w-[320px] mx-auto mb-3">
              <TimeBox value={time.years} label="Anos" />
              <TimeBox value={time.months} label="Meses" />
              <TimeBox value={time.days} label="Dias" />
            </div>
            <div className="flex justify-center gap-3 w-full max-w-[320px] mx-auto">
              <TimeBox value={time.hours} label="Horas" />
              <TimeBox value={time.minutes} label="Min" />
              <TimeBox value={time.seconds} label="Seg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-2.5 w-[72px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
      <span className="text-xl font-medium text-white font-serif tabular-nums leading-none drop-shadow-md">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] text-white/70 uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  );
}

// Player de Música Top Bar
function AudioPlayerTop({ src, searchQuery, forcePlay }: { src?: string, searchQuery?: string, forcePlay?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const input = src || searchQuery;
    if (!input) return;
    
    // Check if it's a YouTube link
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = input.match(ytRegExp);
    if (match && match[2].length === 11) {
      setYoutubeId(match[2]);
      return;
    }

    // Otherwise, search iTunes
    if (src && !src.includes('youtube')) {
      setAudioUrl(src);
      return;
    }
    
    setIsLoading(true);
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(input)}&entity=song&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setAudioUrl(data.results[0].previewUrl);
        }
      })
      .catch(e => console.error("Erro ao buscar música:", e))
      .finally(() => setIsLoading(false));
  }, [searchQuery, src]);

  useEffect(() => {
    if (audioUrl && !youtubeId) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioUrl, youtubeId]);

  useEffect(() => {
    if (forcePlay && !isPlaying && !isLoading) {
      if (youtubeId) {
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.error("Autoplay bloqueado"));
      }
    }
  }, [forcePlay, audioUrl, isLoading, youtubeId]);

  const togglePlay = () => {
    if (isLoading) return;
    if (youtubeId) {
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => console.error("Erro ao tocar"));
      setIsPlaying(!isPlaying);
    }
  };

  const displayName = youtubeId ? "Música Especial" : (searchQuery ? searchQuery : "Áudio Especial");

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 z-50">
      {youtubeId && isPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0`}
          allow="autoplay; encrypted-media"
          className="absolute w-1 h-1 opacity-0 pointer-events-none -z-50"
        />
      )}
      <div className="w-8">
        <Music className={`w-4 h-4 text-white drop-shadow-md ${isPlaying ? 'animate-bounce' : ''}`} />
      </div>
      <div className="flex-1 overflow-hidden text-center mx-4">
        {isLoading ? (
          <div className="text-white/70 text-xs font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" /> Buscando som...
          </div>
        ) : (
          <p className="text-white text-sm font-bold font-sans drop-shadow-md truncate">
            {displayName}
          </p>
        )}
      </div>
      <button onClick={togglePlay} className="w-8 flex justify-end items-center gap-1 group">
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-4">
            <div className="w-1 bg-rose-400 h-full animate-[bounce_1s_infinite]" />
            <div className="w-1 bg-rose-400 h-2/3 animate-[bounce_1.2s_infinite]" />
            <div className="w-1 bg-rose-400 h-4/5 animate-[bounce_0.8s_infinite]" />
          </div>
        ) : (
          <Play className="w-5 h-5 text-white/80 group-hover:text-white drop-shadow-md" fill="currentColor" />
        )}
      </button>
    </div>
  );
}

// Partículas Flutuantes
function FloatingParticles({ particlesColor }: { particlesColor?: string }) {
  const [particles, setParticles] = useState<Array<{id: number, left: number, delay: number, size: number, duration: number}>>([]);
  useEffect(() => {
    // Generate 15 random particles
    const p = Array.from({length: 15}).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2, // 2px to 6px
      duration: Math.random() * 10 + 10 // 10s to 20s
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: "110vh", x: 0, opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            x: Math.random() > 0.5 ? 20 : -20, 
            opacity: [0, 1, 0] 
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear" 
          }}
          className={`absolute rounded-full blur-[1px] ${particlesColor || 'bg-white'}`}
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

interface GiftViewerProps {
  pageData: any;
  isPreviewMode?: boolean;
}

export default function GiftViewer({ pageData, isPreviewMode = false }: GiftViewerProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  
  // Mapeamento de Temas
  const getThemeConfig = (template: string) => {
    switch (template) {
      case 'casamento':
        return {
          primaryColorClass: 'text-amber-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]',
          closedTitle: 'Um convite para você',
          Icon: Gem,
          particlesColor: 'bg-amber-100/60'
        };
      case 'amor':
      case 'historia-amor':
      case 'pedido-namoro':
      case 'dia-namorados':
        return {
          primaryColorClass: 'text-rose-500',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]',
          closedTitle: 'Uma declaração para você',
          Icon: Heart,
          particlesColor: 'bg-rose-200/60'
        };
      case 'mae':
      case 'dia-maes':
        return {
          primaryColorClass: 'text-pink-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]',
          closedTitle: 'Um presente muito especial',
          Icon: Flower2,
          particlesColor: 'bg-pink-200/60'
        };
      case 'pai':
      case 'dia-pais':
        return {
          primaryColorClass: 'text-blue-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]',
          closedTitle: 'Uma homenagem para você',
          Icon: Shield,
          particlesColor: 'bg-blue-200/60'
        };
      case 'aniversario':
        return {
          primaryColorClass: 'text-orange-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]',
          closedTitle: 'Uma surpresa de aniversário',
          Icon: Gift,
          particlesColor: 'bg-orange-200/60'
        };
      case 'filho':
      case 'filha':
      case 'infantil':
      case 'nascimento':
      case 'cha-bebe':
        return {
          primaryColorClass: 'text-emerald-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]',
          closedTitle: 'Um presente especial',
          Icon: Baby,
          particlesColor: 'bg-emerald-200/60'
        };
      case 'formatura':
        return {
          primaryColorClass: 'text-emerald-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]',
          closedTitle: 'Uma homenagem para você',
          Icon: GraduationCap,
          particlesColor: 'bg-emerald-200/60'
        };
      case 'avo':
      case 'avo-f':
      case 'homenagem-avo-f':
      case 'avo-m':
      case 'homenagem-avo-m':
        return {
          primaryColorClass: 'text-purple-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]',
          closedTitle: 'Um presente muito especial',
          Icon: HeartHandshake,
          particlesColor: 'bg-purple-200/60'
        };
      case 'amigo':
      case 'amiga':
        return {
          primaryColorClass: 'text-cyan-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]',
          closedTitle: 'Um presente para você',
          Icon: Users,
          particlesColor: 'bg-cyan-200/60'
        };
      case 'infantil':
        return {
          primaryColorClass: 'text-emerald-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]',
          closedTitle: 'Um presente especial',
          Icon: Baby,
          particlesColor: 'bg-emerald-200/60'
        };
      case 'memorial':
        return {
          primaryColorClass: 'text-indigo-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]',
          closedTitle: 'Em memória especial',
          Icon: Feather,
          particlesColor: 'bg-indigo-200/60'
        };
      case 'pets':
        return {
          primaryColorClass: 'text-teal-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]',
          closedTitle: 'Um presente especial do seu pet',
          Icon: PawPrint,
          particlesColor: 'bg-teal-200/60'
        };
      case 'agradecimento':
        return {
          primaryColorClass: 'text-amber-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]',
          closedTitle: 'Um agradecimento especial',
          Icon: HeartHandshake,
          particlesColor: 'bg-amber-200/60'
        };
      case 'desculpas':
        return {
          primaryColorClass: 'text-rose-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]',
          closedTitle: 'Um pedido sincero',
          Icon: Heart,
          particlesColor: 'bg-rose-200/60'
        };
      case 'comemoracao':
        return {
          primaryColorClass: 'text-violet-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]',
          closedTitle: 'Uma comemoração especial',
          Icon: Star,
          particlesColor: 'bg-violet-200/60'
        };
      case 'aposentadoria':
        return {
          primaryColorClass: 'text-emerald-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]',
          closedTitle: 'Uma nova jornada começa',
          Icon: Gift,
          particlesColor: 'bg-emerald-200/60'
        };
      case 'personalizado':
        return {
          primaryColorClass: 'text-purple-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]',
          closedTitle: 'Um presente para você',
          Icon: Star,
          particlesColor: 'bg-purple-200/60'
        };
      default:
        return {
          primaryColorClass: 'text-rose-400',
          shadowClass: 'drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]',
          closedTitle: 'Um presente para você',
          Icon: Gift,
          particlesColor: 'bg-white/60'
        };
    }
  };

  const theme = getThemeConfig(pageData?.template);

  useEffect(() => {
    if (!isOpened || !pageData?.photos || pageData.photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => {
        if (prev === pageData.photos.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpened, pageData]);

  if (!pageData) return null;

  return (
    <div className={`min-h-[100dvh] bg-[#0a0a0a] flex justify-center overflow-hidden font-sans ${isPreviewMode ? 'w-full' : ''}`}>
      {!isPreviewMode && (
        <Helmet>
          <title>{`${pageData.name || pageData.name1 || 'Alguém'} ${pageData.name2 ? `& ${pageData.name2}` : ''} | Presente Mágico`}</title>
          <meta name="description" content="Alguém criou um presente mágico muito especial para você." />
        </Helmet>
      )}
      <div className={`w-full ${isPreviewMode ? '' : 'max-w-md'} h-[100dvh] relative bg-black shadow-2xl overflow-hidden flex flex-col`}>
        {/* Botão de Denúncia (Visível após abrir) */}
        {isOpened && !isPreviewMode && (
          <a href="mailto:contato@presentemagic.com.br?subject=Denúncia de Conteúdo - Presente Mágico" title="Denunciar conteúdo impróprio" className="absolute top-4 right-4 z-[70] p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/50 hover:text-white/80 transition-all">
            <Flag className="w-4 h-4" />
          </a>
        )}
        <AnimatePresence>
          {!isOpened && (
            <motion.div exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-3xl px-6">
              <motion.button onClick={() => setIsOpened(true)} className="flex flex-col items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-sm group">
                <theme.Icon className={`w-16 h-16 ${theme.primaryColorClass} ${theme.shadowClass} group-hover:scale-110 transition-transform duration-500 ${pageData?.template === 'casamento' || pageData?.template === 'amor' ? 'animate-pulse' : ''}`} />
                <h2 className="text-2xl font-serif text-white text-center">{theme.closedTitle}</h2>
                
                {pageData.message && (
                  <div className="w-full py-4 border-y border-white/10 my-2">
                    <p className="text-white/80 text-[13px] font-serif italic text-center leading-relaxed max-h-[25vh] overflow-y-auto whitespace-pre-wrap px-2">
                      "{pageData.message}"
                    </p>
                  </div>
                )}
                
                {(pageData.date || pageData.address) && (
                  <div className="w-full flex flex-col items-center gap-2 mb-2">
                    {pageData.date && (
                      <div className="flex items-center gap-2 text-white/90 text-xs font-medium tracking-wide bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Calendar className={`w-3.5 h-3.5 ${theme.primaryColorClass}`} />
                        <span>
                          {new Date(pageData.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          {pageData.time && ` às ${pageData.time}`}
                        </span>
                      </div>
                    )}
                    {pageData.address && (
                      <div className="flex items-center gap-2 text-white/90 text-[11px] max-w-[280px] text-center bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${theme.primaryColorClass}`} />
                        <span className="truncate">{pageData.address}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-semibold text-sm shadow-xl animate-pulse mt-2">Toque para Abrir</div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {pageData.photos && pageData.photos.map((photo: any, index: number) => {
              if (index !== currentPhoto) return null;
              const url = typeof photo === 'string' ? photo : (photo.preview || photo.url);
              if (!url) return null;
              
              return (
                <motion.img 
                  key={index} 
                  src={url} 
                  initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }} 
                  animate={{ 
                    opacity: 1, 
                    filter: !isOpened ? "blur(15px)" : "blur(0px)",
                    scale: !isOpened ? 1.05 : 1
                  }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              );
            })}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />

        <div className="relative z-20 flex flex-col h-full w-full">
          {isOpened && <FloatingParticles particlesColor={theme.particlesColor} />}
          {isOpened && (pageData.music || pageData.musicUrl || pageData.audio) && <AudioPlayerTop searchQuery={pageData.music} src={pageData.musicUrl || pageData.audio} forcePlay={isOpened} />}
          
          <div className="flex-1" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.5, staggerChildren: 0.3 }}
            className="w-full flex flex-col items-center pb-8 px-4"
          >
            
            {/* Elemento de Topo: Data desde */}
            {pageData.startDate && (
              <motion.div initial={{ opacity: 0 }} animate={isOpened ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1 }} className="text-white/70 text-[10px] mb-2 font-sans font-medium tracking-[0.2em] uppercase">
                Desde {new Date(pageData.startDate).toLocaleDateString('pt-BR')} ❤️
              </motion.div>
            )}

            {/* Nomes */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={isOpened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} transition={{ delay: 1.2, duration: 0.8 }}
              className="text-3xl font-bold font-serif text-white mb-6 text-center drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] tracking-wide"
            >
              {pageData.name || pageData.name1} {pageData.name2 ? `& ${pageData.name2}` : ''}
            </motion.h1>
            
            {/* Contador */}
            {pageData.startDate && (
              <motion.div initial={{ opacity: 0 }} animate={isOpened ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.5 }} className="w-full mb-6">
                <LoveCounter startDate={pageData.startDate} />
              </motion.div>
            )}
            
            {/* Pontinhos do Slideshow */}
            {pageData.photos?.length > 1 && (
              <div className="flex gap-2 mb-4 mt-2">
                {pageData.photos.map((_: any, i: number) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 shadow-sm ${i === currentPhoto ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />)}
              </div>
            )}
            
            {/* Detalhes do Evento Interno */}
            {(pageData.date || pageData.address) && (
              <motion.div initial={{ opacity: 0 }} animate={isOpened ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.8 }} className="w-full flex flex-col items-center gap-2 mb-6">
                {pageData.date && (
                  <div className="flex items-center gap-2 text-white/90 text-xs font-medium tracking-wide bg-black/30 px-5 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                    <Calendar className={`w-4 h-4 ${theme.primaryColorClass}`} />
                    <span>
                      {new Date(pageData.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      {pageData.time && ` às ${pageData.time}`}
                    </span>
                  </div>
                )}
                {pageData.address && (
                  <div className="flex items-center gap-2 text-white/90 text-[11px] max-w-[280px] text-center bg-black/30 px-5 py-2 rounded-full backdrop-blur-md border border-white/10 mt-1 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${theme.primaryColorClass}`} />
                    <span className="truncate">{pageData.address}</span>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Texto Dinâmico de cada Imagem (Caption) */}
            <motion.div initial={{ opacity: 0 }} animate={isOpened ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2.2 }} className="w-full max-w-sm min-h-[80px] flex items-center justify-center mt-2 px-4 relative">
              <AnimatePresence mode="wait">
                {pageData.photos && pageData.photos.map((photo: any, index: number) => {
                  if (index !== currentPhoto) return null;
                  const caption = typeof photo !== 'string' && photo.caption ? photo.caption : null;
                  if (!caption) return null;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-full px-6 py-5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    >
                      <div className="absolute -top-4 left-4 text-4xl text-rose-400/40 font-serif leading-none">❝</div>
                      <p className="text-white text-[15px] font-serif italic text-center leading-relaxed drop-shadow-md relative z-10 px-2">
                        {caption}
                      </p>
                      <div className="absolute -bottom-6 right-4 text-4xl text-rose-400/40 font-serif leading-none rotate-180">❝</div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* RODAPÉ WHITE-LABEL OU PADRÃO */}
          <motion.div initial={{ opacity: 0 }} animate={isOpened ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2.5 }} className="absolute bottom-6 w-full flex justify-center px-4 z-[60]">
            {pageData.creator_plan === 'agency' ? (
              <div className="flex flex-col items-center">
                {pageData.agency_logo_url && (
                  <img src={pageData.agency_logo_url} alt={pageData.agency_name || "Agência"} className="h-8 object-contain mb-2 opacity-80" />
                )}
                <p className="text-[10px] text-white/50 tracking-wider uppercase mb-2">Experiência organizada por {pageData.agency_name || "Cerimonial"}</p>
                {pageData.agency_whatsapp && (
                  <a href={`https://wa.me/${pageData.agency_whatsapp}?text=Olá! Adorei o presente interativo e gostaria de um orçamento para o meu evento.`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold border border-white/10 transition-all shadow-lg pointer-events-auto">
                    <MessageCircle className="w-3.5 h-3.5" /> Fale Conosco
                  </a>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-auto">
                <p className="text-[10px] text-white/50 tracking-wider uppercase flex items-center gap-1">Feito com <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> por Presente Mágico</p>
                <a href="https://presentemagic.com.br" target="_blank" rel="noreferrer" className="mt-1 text-[10px] text-white/80 font-bold hover:text-white transition-colors">Crie o seu também</a>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
