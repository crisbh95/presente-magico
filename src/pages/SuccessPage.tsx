import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Check, Mail, Copy, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function SuccessPage() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  
  const pageId = location.state?.pageId;

  if (!pageId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
        <Link to="/dashboard" className="text-primary hover:underline">Voltar para o Dashboard</Link>
      </div>
    );
  }

  // Para o QR Code funcionar no celular enquanto testa localmente, 
  // ideal seria o IP da rede (ex: 192.168.0.x). 
  // Usamos origin por padrão, mas se for localhost, o celular não vai achar.
  const isLocalhost = window.location.hostname === 'localhost';
  const displayUrl = isLocalhost 
    ? `http://presentemagico.app/p/${pageId} (Exemplo Público)` 
    : `${window.location.origin}/p/${pageId}`;
    
  const scanUrl = `${window.location.origin}/p/${pageId}`;



  const downloadQRCode = () => {
    const svg = document.getElementById('qrcode');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.download = `QR_Presente_Magico_${pageId}.svg`;
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-500" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500"
        >
          <Check size={40} strokeWidth={3} />
        </motion.div>
        
        <h1 className="text-3xl font-extrabold mb-2">Presente Criado!</h1>
        <p className="text-slate-500 mb-8">A mágica foi gerada com sucesso. Agora é só compartilhar e emocionar.</p>

        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl mb-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 inline-block">
            <QRCodeSVG 
              id="qrcode"
              value={scanUrl} 
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#0f172a"}
              level={"H"}
              includeMargin={false}
            />
          </div>
          
          {isLocalhost && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-4 max-w-xs text-center bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
              Nota: Como o site está rodando no seu computador (localhost), o seu celular não conseguirá abrir o link ao ler o QR Code. Isso funcionará perfeitamente quando publicarmos o site.
            </p>
          )}
          
          <div className="flex gap-4 w-full">
            <button onClick={downloadQRCode} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition">
              <Download size={18} /> Baixar QR
            </button>
            <a 
              href={`mailto:?subject=Um presente mágico para você!&body=Fiz uma surpresa muito especial. Veja aqui: ${scanUrl}`}
              className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-300 transition"
            >
              <Mail size={18} /> E-mail
            </a>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-left text-slate-500">Ou envie o link direto:</label>
          <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <input 
              type="text" 
              readOnly 
              value={displayUrl} 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-600 dark:text-slate-400 text-sm" 
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(scanUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`px-6 font-semibold flex items-center gap-2 transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
          <Link to="/dashboard" className="text-slate-500 font-medium hover:text-slate-800 dark:hover:text-white">
            Ir para o Dashboard
          </Link>
          <Link to={`/p/${pageId}`} target="_blank" className="text-primary font-bold flex items-center gap-1 hover:underline">
            Ver como ficou <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
