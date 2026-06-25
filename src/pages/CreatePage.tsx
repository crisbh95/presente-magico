import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import LoveWizard from '../components/forms/LoveWizard';
import BirthdayWizard from '../components/forms/BirthdayWizard';
import MotherWizard from '../components/forms/MotherWizard';
import FatherWizard from '../components/forms/FatherWizard';
import MemorialWizard from '../components/forms/MemorialWizard';
import WeddingWizard from '../components/forms/WeddingWizard';
import KidsWizard from '../components/forms/KidsWizard';
import PetWizard from '../components/forms/PetWizard';
import GraduationWizard from '../components/forms/GraduationWizard';

const TEMPLATES = [
  { id: 'amor', name: 'História de Amor', icon: '❤️' },
  { id: 'aniversario', name: 'Aniversário', icon: '🎂' },
  { id: 'mae', name: 'Homenagem para Mãe', icon: '👩‍👧' },
  { id: 'pai', name: 'Homenagem para Pai', icon: '👨' },
  { id: 'memorial', name: 'Memorial', icon: '🕊️' },
  { id: 'casamento', name: 'Casamento', icon: '💍' },
  { id: 'infantil', name: 'Festa Infantil', icon: '🎉' },
  { id: 'pets', name: 'Pet', icon: '🐾' },
  { id: 'formatura', name: 'Formatura', icon: '🎓' },
];

export default function CreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [template, setTemplate] = useState('');

  // Seta o template inicial com base no que veio da Home
  useEffect(() => {
    if (location.state?.template) {
      setTemplate(location.state.template);
    }
  }, [location]);

  const handleBack = () => {
    // Se veio da home com state, ao cancelar volta pra home. 
    // Se não, só apaga o state interno (fallback).
    if (location.state?.template) {
      navigate('/');
    } else {
      setTemplate('');
    }
  };
  
  if (template === 'amor') return <LoveWizard onBack={handleBack} />;
  if (template === 'aniversario') return <BirthdayWizard onBack={handleBack} />;
  if (template === 'mae') return <MotherWizard onBack={handleBack} />;
  if (template === 'pai') return <FatherWizard onBack={handleBack} />;
  if (template === 'memorial') return <MemorialWizard onBack={handleBack} />;
  if (template === 'casamento') return <WeddingWizard onBack={handleBack} />;
  if (template === 'infantil') return <KidsWizard onBack={handleBack} />;
  if (template === 'pets') return <PetWizard onBack={handleBack} />;
  if (template === 'formatura') return <GraduationWizard onBack={handleBack} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-slate-800 dark:text-slate-100">
          Qual presente você deseja criar hoje?
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {TEMPLATES.map(t => (
            <motion.button
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="p-8 rounded-[2rem] flex flex-col items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-primary/50 transition-colors"
            >
              <span className="text-5xl md:text-6xl mb-2">{t.icon}</span>
              <span className="font-bold text-lg text-center text-slate-700 dark:text-slate-300">{t.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
