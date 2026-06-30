import { UploadCloud, X, Sparkles, Loader2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePhotoCaption } from '../../services/ai';
import { useState } from 'react';

export interface PhotoWithCaption {
  file: File;
  preview: string;
  caption: string;
}

interface Props {
  photos: PhotoWithCaption[];
  onChange: (photos: PhotoWithCaption[]) => void;
  maxPhotos?: number;
  themeColor?: string; // e.g., 'rose', 'emerald', 'yellow', 'stone', 'blue', 'indigo', 'purple', 'slate'
}

const THEME_STYLES = {
  rose: {
    border: 'border-rose-200', bg: 'bg-rose-50/50', hoverBg: 'hover:bg-rose-100/50',
    text: 'text-rose-600', textLight: 'text-rose-400', focusBorder: 'focus:border-rose-400',
    focusRing: 'focus-within:ring-rose-200', ring: 'ring-rose-100', btnBg: 'bg-rose-50', btnHover: 'hover:bg-rose-100',
  },
  pink: {
    border: 'border-pink-200', bg: 'bg-pink-50/50', hoverBg: 'hover:bg-pink-100/50',
    text: 'text-pink-600', textLight: 'text-pink-400', focusBorder: 'focus:border-pink-400',
    focusRing: 'focus-within:ring-pink-200', ring: 'ring-pink-100', btnBg: 'bg-pink-50', btnHover: 'hover:bg-pink-100',
  },
  emerald: {
    border: 'border-emerald-200', bg: 'bg-emerald-50/50', hoverBg: 'hover:bg-emerald-100/50',
    text: 'text-emerald-600', textLight: 'text-emerald-400', focusBorder: 'focus:border-emerald-400',
    focusRing: 'focus-within:ring-emerald-200', ring: 'ring-emerald-100', btnBg: 'bg-emerald-50', btnHover: 'hover:bg-emerald-100',
  },
  amber: {
    border: 'border-amber-200', bg: 'bg-amber-50/50', hoverBg: 'hover:bg-amber-100/50',
    text: 'text-amber-600', textLight: 'text-amber-400', focusBorder: 'focus:border-amber-400',
    focusRing: 'focus-within:ring-amber-200', ring: 'ring-amber-100', btnBg: 'bg-amber-50', btnHover: 'hover:bg-amber-100',
  },
  blue: {
    border: 'border-blue-200', bg: 'bg-blue-50/50', hoverBg: 'hover:bg-blue-100/50',
    text: 'text-blue-600', textLight: 'text-blue-400', focusBorder: 'focus:border-blue-400',
    focusRing: 'focus-within:ring-blue-200', ring: 'ring-blue-100', btnBg: 'bg-blue-50', btnHover: 'hover:bg-blue-100',
  },
  indigo: {
    border: 'border-indigo-200', bg: 'bg-indigo-50/50', hoverBg: 'hover:bg-indigo-100/50',
    text: 'text-indigo-600', textLight: 'text-indigo-400', focusBorder: 'focus:border-indigo-400',
    focusRing: 'focus-within:ring-indigo-200', ring: 'ring-indigo-100', btnBg: 'bg-indigo-50', btnHover: 'hover:bg-indigo-100',
  },
  purple: {
    border: 'border-purple-200', bg: 'bg-purple-50/50', hoverBg: 'hover:bg-purple-100/50',
    text: 'text-purple-600', textLight: 'text-purple-400', focusBorder: 'focus:border-purple-400',
    focusRing: 'focus-within:ring-purple-200', ring: 'ring-purple-100', btnBg: 'bg-purple-50', btnHover: 'hover:bg-purple-100',
  },
  slate: {
    border: 'border-slate-200', bg: 'bg-slate-50/50', hoverBg: 'hover:bg-slate-100/50',
    text: 'text-slate-600', textLight: 'text-slate-400', focusBorder: 'focus:border-slate-400',
    focusRing: 'focus-within:ring-slate-200', ring: 'ring-slate-100', btnBg: 'bg-slate-50', btnHover: 'hover:bg-slate-100',
  },
};

export default function PhotoUploadWithCaption({ photos, onChange, maxPhotos = 10, themeColor = 'slate' }: Props) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const s = THEME_STYLES[themeColor as keyof typeof THEME_STYLES] || THEME_STYLES.slate;

  const handleReplacePhoto = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updated = [...photos];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated[index] = {
        ...updated[index],
        file,
        preview: URL.createObjectURL(file)
      };
      onChange(updated);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPhotos: PhotoWithCaption[] = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        caption: ''
      }));
      const combined = [...photos, ...newPhotos].slice(0, maxPhotos);
      onChange(combined);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const photoToRemove = photos[indexToRemove];
    if (photoToRemove.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    onChange(photos.filter((_, idx) => idx !== indexToRemove));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index].caption = caption;
    onChange(updated);
  };

  const handleGenerateCaption = async (index: number) => {
    setLoadingIndex(index);
    try {
      const generated = await generatePhotoCaption();
      updateCaption(index, generated);
    } catch (e) {
      console.error("Erro ao gerar legenda:", e);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {photos.length < maxPhotos && (
        <label className={`block border-2 border-dashed ${s.border} dark:border-slate-700 ${s.bg} dark:bg-slate-800/50 rounded-3xl p-8 text-center cursor-pointer ${s.hoverBg} transition-colors`}>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          <UploadCloud className={`w-10 h-10 ${s.textLight} mx-auto mb-3`} />
          <p className="font-medium text-slate-700 dark:text-slate-300">Toque ou arraste as fotos aqui</p>
          <p className="text-xs text-slate-500 mt-2">Até {maxPhotos} fotos (JPEG, PNG ou HEIC)</p>
        </label>
      )}

      {photos.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Fotos adicionadas ({photos.length}/{maxPhotos}):</h3>
          <AnimatePresence>
            {photos.map((photo, idx) => (
              <motion.div 
                key={photo.preview}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row gap-4 p-3 relative ${s.focusRing}`}
              >
                <button 
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition z-10"
                >
                  <X size={14} />
                </button>
                
                <div className="w-full md:w-32 h-32 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                  <img src={photo.preview || '/placeholder.png'} alt="Preview" className="w-full h-full object-cover" />
                  <label className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg border border-white/20 cursor-pointer transition shadow-md flex items-center justify-center" title="Trocar Foto">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleReplacePhoto(idx, e)} 
                    />
                    <Edit2 size={12} />
                  </label>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Legenda para esta foto</label>
                    <button 
                      type="button" 
                      onClick={() => handleGenerateCaption(idx)}
                      disabled={loadingIndex === idx}
                      className={`text-[10px] sm:text-xs ${s.text} ${s.btnBg} ${s.btnHover} px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors`}
                    >
                      {loadingIndex === idx ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      IA Criativa
                    </button>
                  </div>
                  <textarea 
                    rows={2}
                    value={photo.caption}
                    onChange={(e) => updateCaption(idx, e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm outline-none ${s.focusBorder} focus:ring-4 ${s.ring} transition-all resize-none`}
                    placeholder="Escreva algo especial que viveu nesse momento..."
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
