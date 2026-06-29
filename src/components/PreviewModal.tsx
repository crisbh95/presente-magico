import { X } from 'lucide-react';
import GiftViewer from './GiftViewer';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageData: any;
}

export default function PreviewModal({ isOpen, onClose, pageData }: PreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-[100dvh] bg-black shadow-2xl overflow-hidden"
          >
            {/* Botão de Fechar */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-[99999] bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md text-white transition"
            >
              <X size={24} />
            </button>

            {/* Renderiza o presente passando os dados dinâmicos do formulário */}
            <GiftViewer pageData={pageData} isPreviewMode={true} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
