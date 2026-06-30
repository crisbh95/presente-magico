import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LoveWizard from '../components/forms/LoveWizard';
import BirthdayWizard from '../components/forms/BirthdayWizard';
import MotherWizard from '../components/forms/MotherWizard';
import FatherWizard from '../components/forms/FatherWizard';
import MemorialWizard from '../components/forms/MemorialWizard';
import WeddingWizard from '../components/forms/WeddingWizard';
import KidsWizard from '../components/forms/KidsWizard';
import PetWizard from '../components/forms/PetWizard';
import GraduationWizard from '../components/forms/GraduationWizard';
import GenericWizard from '../components/forms/GenericWizard';
import { useAuth } from '../contexts/AuthContext';
import { getUserPages } from '../services/db';
import { trackEvent } from '../services/analytics';
import { Crown, Lock } from 'lucide-react';
import { wizardState } from '../services/wizardState';

const RECIPIENTS = [
  { id: 'amor', name: 'Meu Amor', icon: '❤️' },
  { id: 'mae', name: 'Minha Mãe', icon: '👩' },
  { id: 'pai', name: 'Meu Pai', icon: '👨' },
  { id: 'avo-f', name: 'Minha Avó', icon: '👵' },
  { id: 'avo-m', name: 'Meu Avô', icon: '👴' },
  { id: 'filha', name: 'Minha Filha', icon: '👧' },
  { id: 'filho', name: 'Meu Filho', icon: '👦' },
  { id: 'melhor-amiga', name: 'Minha Melhor Amiga', icon: '👭' },
  { id: 'melhor-amigo', name: 'Meu Melhor Amigo', icon: '👬' },
  { id: 'amigo', name: 'Um Amigo(a)', icon: '🤝' },
  { id: 'familia', name: 'Minha Família', icon: '👨‍👩‍👧' },
  { id: 'pet', name: 'Meu Pet', icon: '🐾', isPremium: true },
  { id: 'outro', name: 'Outra Pessoa', icon: '✨' },
];

const OCCASIONS = [
  { id: 'historia-amor', name: 'História de Amor', icon: '❤️' },
  { id: 'pedido-namoro', name: 'Pedido de Namoro', icon: '💍' },
  { id: 'casamento', name: 'Casamento', icon: '💒', isPremium: true },
  { id: 'dia-namorados', name: 'Dia dos Namorados', icon: '💖' },
  { id: 'aniversario', name: 'Aniversário', icon: '🎂' },
  { id: 'comemoracao', name: 'Comemoração Especial', icon: '🎉' },
  { id: 'dia-maes', name: 'Dia das Mães', icon: '👩' },
  { id: 'dia-pais', name: 'Dia dos Pais', icon: '👨' },
  { id: 'homenagem-avo-f', name: 'Homenagem para Avó', icon: '👵' },
  { id: 'homenagem-avo-m', name: 'Homenagem para Avô', icon: '👴' },
  { id: 'nascimento', name: 'Nascimento', icon: '👶', isPremium: true },
  { id: 'cha-bebe', name: 'Chá de Bebê', icon: '🍼', isPremium: true },
  { id: 'formatura', name: 'Formatura', icon: '🎓', isPremium: true },
  { id: 'aposentadoria', name: 'Aposentadoria', icon: '💼', isPremium: true },
  { id: 'agradecimento', name: 'Agradecimento', icon: '🙏' },
  { id: 'desculpas', name: 'Pedido de Desculpas', icon: '💌' },
  { id: 'pet', name: 'Pet', icon: '🐾', isPremium: true },
  { id: 'memorial', name: 'Memorial', icon: '🕊️', isPremium: true },
  { id: 'personalizado', name: 'Personalizado', icon: '✨', isPremium: true },
];

export default function CreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [step, setStep] = useState(wizardState.createPage.step);
  const [recipient, setRecipient] = useState(wizardState.createPage.recipient);
  const [occasion, setOccasion] = useState(wizardState.createPage.occasion);
  const [mappedWizard, setMappedWizard] = useState(wizardState.createPage.mappedWizard);

  useEffect(() => {
    wizardState.createPage = { step, recipient, occasion, mappedWizard };
  }, [step, recipient, occasion, mappedWizard]);

  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  // Verificação Anti-Fraude (Limita usuários Free a 1 presente)
  useEffect(() => {
    const checkLimit = async () => {
      if (!user) return;
      if (!isPremium) {
        const userPages = await getUserPages(user.id);
        if (userPages.length >= 1) {
          setHasReachedLimit(true);
        }
      }
    };
    checkLimit();
  }, [user, isPremium]);

  // Modo Visitante: restaurar fluxo após login
  useEffect(() => {
    const pending = localStorage.getItem('pendingCreate');
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        const { recipient: r, draftKey, timestamp } = parsed;
        // Expirar pendingCreate após 24h
        if (timestamp && Date.now() - timestamp > 86400000) {
          localStorage.removeItem('pendingCreate');
          return;
        }
        if (r) setRecipient(r);
        if (draftKey) {
          const occasionMap: Record<string, string> = {
            'draft_amor': 'historia-amor',
            'draft_mae': 'dia-maes',
            'draft_avo-f': 'homenagem-avo-f',
            'draft_pai': 'dia-pais',
            'draft_avo-m': 'homenagem-avo-m',
            'draft_aniversario': 'aniversario',
            'draft_memorial': 'memorial',
            'draft_casamento': 'casamento',
            'draft_infantil': 'nascimento',
            'draft_pet': 'pet',
            'draft_formatura': 'formatura',
            'draft_generic_agradecimento': 'agradecimento',
            'draft_generic_desculpas': 'desculpas',
            'draft_generic_comemoracao': 'comemoracao',
            'draft_generic_aposentadoria': 'aposentadoria',
            'draft_generic_personalizado': 'personalizado',
          };
          
          // Fallback: extrair ocasião do draftKey para drafts genéricos não listados
          let o = occasionMap[draftKey];
          if (!o && draftKey.startsWith('draft_generic_')) {
            o = draftKey.replace('draft_generic_', '');
          }
          if (o) setOccasion(o);
        }
        setStep(3);
      } finally {
        localStorage.removeItem('pendingCreate');
      }
    }
  }, []);

  // Handle auto-routing from Home Quick Links if any
  useEffect(() => {
    if (location.state?.template) {
      const t = location.state.template;
      // Map legacy templates to the new flow directly
      if (t === 'amor') { setRecipient('amor'); setOccasion('historia-amor'); }
      else if (t === 'mae') { setRecipient('mae'); setOccasion('dia-maes'); }
      else if (t === 'pai') { setRecipient('pai'); setOccasion('dia-pais'); }
      else if (t === 'aniversario') { setRecipient('outro'); setOccasion('aniversario'); }
      else if (t === 'filho') { setRecipient('filho'); setOccasion('aniversario'); }
      else if (t === 'irmao') { setRecipient('melhor-amigo'); setOccasion('comemoracao'); }
      else if (t === 'avo') { setRecipient('avo-f'); setOccasion('homenagem-avo-f'); }
      else if (t === 'amigo') { setRecipient('amigo'); setOccasion('comemoracao'); }
    }
  }, [location]);

  // When both are selected, map to the correct wizard
  // REGRA: A OCASIÃO sempre tem prioridade sobre o destinatário
  useEffect(() => {
    if (recipient && occasion) {
      let w = 'amor'; // fallback

      // === OCASIÕES ESPECÍFICAS (sempre prioridade) ===
      
      // Amor / Namoro
      if (occasion === 'historia-amor' || occasion === 'pedido-namoro' || occasion === 'dia-namorados') {
        w = 'amor';
      }
      // Casamento (cerimônia)
      else if (occasion === 'casamento') {
        w = 'casamento';
      }
      // Aniversário
      else if (occasion === 'aniversario') {
        w = 'aniversario';
      }
      // Dia das Mães / Homenagem Avó
      else if (occasion === 'dia-maes' || occasion === 'homenagem-avo-f') {
        w = 'mae';
      }
      // Dia dos Pais / Homenagem Avô
      else if (occasion === 'dia-pais' || occasion === 'homenagem-avo-m') {
        w = 'pai';
      }
      // Formatura
      else if (occasion === 'formatura') {
        w = 'formatura';
      }
      // Memorial
      else if (occasion === 'memorial') {
        w = 'memorial';
      }
      // Pet
      else if (occasion === 'pet') {
        w = 'pets';
      }
      // Nascimento / Chá de Bebê
      else if (occasion === 'nascimento' || occasion === 'cha-bebe') {
        w = 'infantil';
      }
      // Agradecimento / Desculpas / Personalizado / Comemoração / Aposentadoria → GenericWizard
      else if (occasion === 'agradecimento' || occasion === 'desculpas' || occasion === 'personalizado' || occasion === 'comemoracao' || occasion === 'aposentadoria') {
        w = 'generico';
      }
      // === FALLBACK PELO DESTINATÁRIO (só se a ocasião não decidiu) ===
      else if (recipient === 'mae' || recipient === 'avo-f') {
        w = 'mae';
      }
      else if (recipient === 'pai' || recipient === 'avo-m') {
        w = 'pai';
      }
      else if (recipient === 'pet') {
        w = 'pets';
      }
      else if (recipient === 'filho' || recipient === 'filha') {
        w = 'infantil';
      }

      setMappedWizard(w);
      setStep(3);
    }
  }, [recipient, occasion]);

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setOccasion('');
      setMappedWizard('');
    } else if (step === 2) {
      setStep(1);
      setRecipient('');
    } else {
      navigate(user ? '/dashboard' : '/');
    }
  };
  
  if (step === 3 && mappedWizard) {
    if (mappedWizard === 'amor') return <LoveWizard onBack={handleBack} recipient={recipient} occasion={occasion} />;
    if (mappedWizard === 'aniversario') return <BirthdayWizard onBack={handleBack} />;
    if (mappedWizard === 'mae') return <MotherWizard onBack={handleBack} recipient={recipient} occasion={occasion} />;
    if (mappedWizard === 'pai') return <FatherWizard onBack={handleBack} recipient={recipient} occasion={occasion} />;
    if (mappedWizard === 'memorial') return <MemorialWizard onBack={handleBack} />;
    if (mappedWizard === 'casamento') return <WeddingWizard onBack={handleBack} />;
    if (mappedWizard === 'infantil') return <KidsWizard onBack={handleBack} />;
    if (mappedWizard === 'pets') return <PetWizard onBack={handleBack} />;
    if (mappedWizard === 'formatura') return <GraduationWizard onBack={handleBack} />;
    if (mappedWizard === 'generico') return <GenericWizard onBack={handleBack} occasion={occasion} recipient={recipient} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Efeito de brilho no fundo */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="flex justify-between items-center mb-10">
          <button onClick={handleBack} className="text-white/50 hover:text-white hover:neon-text transition-all duration-300 font-medium flex items-center gap-2">
            ← Voltar
          </button>
          <Link to="/" className="flex items-center group">
            <img src="/logo.jpeg" alt="Presente Mágico" className="w-12 h-12 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(255,0,127,0.3)] group-hover:neon-glow group-hover:scale-110 transition-all duration-300" />
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-14 text-white drop-shadow-lg">
          {step === 1 ? 'Para quem é este presente?' : 'Qual é a ocasião?'}
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {(step === 1 ? RECIPIENTS : OCCASIONS).map(item => (
            <motion.button
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={item.id}
              onClick={() => {
                // Bloqueio de plano Premium (só para usuários logados)
                if (user && 'isPremium' in item && item.isPremium && !isPremium) {
                  navigate('/plans');
                  return;
                }

                // Bloqueio de limite Free (só para usuários logados)
                if (user && hasReachedLimit && !isPremium) {
                  trackEvent('PREMIUM_BLOCKED_FREE_LIMIT', { user_id: user.id, selected_recipient: item.id });
                  navigate('/plans');
                  return;
                }

                if (step === 1) {
                  trackEvent('RECIPIENT_SELECTED', { recipient_id: item.id, is_premium_item: !!item.isPremium });
                  setRecipient(item.id);
                  setStep(2);
                } else {
                  trackEvent('OCCASION_SELECTED', { occasion_id: item.id, recipient_id: recipient });
                  setOccasion(item.id);
                }
              }}
              className={`p-6 md:p-8 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] border transition-all duration-300 group relative overflow-hidden ${
                'isPremium' in item && item.isPremium 
                  ? 'border-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:-translate-y-1' 
                  : 'border-white/10 hover:border-primary/80 hover:neon-glow hover:-translate-y-1'
              }`}
            >
              {'isPremium' in item && item.isPremium && (
                <div className="absolute top-3 right-3 text-amber-500 flex items-center justify-center bg-amber-50 dark:bg-amber-500/10 p-1.5 rounded-full" title="Exclusivo Premium">
                  {!isPremium ? <Lock className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                </div>
              )}
              <span className="text-4xl md:text-5xl mb-2 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 drop-shadow-md">{item.icon}</span>
              <span className="font-bold text-[13px] md:text-sm text-center text-white/70 group-hover:text-white transition-colors leading-tight">
                {item.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
