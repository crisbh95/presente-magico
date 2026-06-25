import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Play, Pause, Music } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Contador Dinâmico Exato (Estilo Clean/Romântico para combinar com a Polaróide)
function LoveCounter({ startDate }: { startDate: string }) {
  const [time, setTime] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date(startDate).getTime();
    if (isNaN(start)) return;

    const updateCounter = () => {
      const now = new Date().getTime();
      const diff = now - start;
      if (diff < 0) return;

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.44);
      const days = Math.floor((totalDays % 365.25) % 30.44);
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ years, months, days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="w-full mb-8">
      <h3 className="text-center font-serif text-rose-500 mb-4 text-lg md:text-xl italic">Compartilhando momentos há...</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 w-full max-w-xl mx-auto">
        <TimeBox value={time.years} label="Anos" />
        <TimeBox value={time.months} label="Meses" />
        <TimeBox value={time.days} label="Dias" />
        <TimeBox value={time.hours} label="Horas" />
        <TimeBox value={time.minutes} label="Minutos" />
        <TimeBox value={time.seconds} label="Segundos" />
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-100 rounded-2xl p-2 shadow-sm">
      <span className="text-2xl md:text-3xl font-extrabold text-rose-600 font-serif tabular-nums tracking-tighter">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs font-bold text-rose-400 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

// Player de Música Ambiente Flutuante
function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.button 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={togglePlay}
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 p-4 rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all z-50 ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-rose-500 hover:bg-rose-50'}`}
    >
      {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
      {isPlaying && (
        <span className="font-medium pr-2 flex items-center gap-2">
          <Music className="w-4 h-4 animate-bounce" /> Nossa Música
        </span>
      )}
    </motion.button>
  );
}

export default function ViewPage() {
  const { id } = useParams();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Dados reais mockados (No futuro virá do Firebase usando o ID)
  const pageData = {
    name1: "João",
    name2: "Maria",
    startDate: "2023-06-12",
    message: "Meu amor, desde o momento em que nos conhecemos, minha vida ganhou mais cor e sentido. Cada instante ao seu lado é um presente mágico. Que possamos construir juntos uma eternidade de momentos felizes.",
    photoUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  };

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* Player de Música Flutuante */}
      {pageData.musicUrl && <AudioPlayer src={pageData.musicUrl} />}

      {/* Corações Caindo (Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", x: Math.random() * windowSize.width, opacity: 0 }}
            animate={{ 
              y: "-10vh", 
              x: Math.random() * windowSize.width, 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute text-rose-300"
          >
            <Heart size={20 + Math.random() * 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/90 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-white relative z-10 text-center"
      >
        {/* Nomes e Coração */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-rose-600">
            {pageData.name1}
          </h1>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-rose-600">
            {pageData.name2}
          </h1>
        </div>
        
        {/* Imagem Polaróide Inclinada */}
        <div className="w-full bg-white p-3 md:p-4 pb-12 md:pb-16 rounded-lg shadow-xl mb-12 rotate-1 hover:rotate-0 transition-transform duration-500 mx-auto max-w-md">
          <div className="aspect-[4/5] md:aspect-[4/3] w-full rounded overflow-hidden">
            <img 
              src={pageData.photoUrl} 
              alt="Casal" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>

        {/* O Contador Integrado de forma elegante */}
        {pageData.startDate && <LoveCounter startDate={pageData.startDate} />}

        {/* Mensagem da IA/Usuário */}
        <div className="relative mt-8">
          <span className="absolute -top-4 -left-2 text-4xl text-rose-200 font-serif">"</span>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed italic z-10 relative px-4">
            {pageData.message}
          </p>
          <span className="absolute -bottom-8 -right-2 text-4xl text-rose-200 font-serif">"</span>
        </div>

        {/* Data Final */}
        <div className="mt-12 text-rose-400 font-medium">
          Desde {new Date(pageData.startDate).toLocaleDateString('pt-BR')}
        </div>
      </motion.div>
    </div>
  );
}
