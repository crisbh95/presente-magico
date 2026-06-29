import { Helmet } from 'react-helmet-async';
import { MessageCircle, Mail, HelpCircle, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contato() {
  const WHATSAPP_LINK = "https://wa.me/message/MJ33P725HOFKI1";
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex items-center justify-center p-4">
      <Helmet>
        <title>Fale Conosco | Presente Mágico</title>
      </Helmet>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative">
        <div className="p-8 text-center bg-gradient-to-br from-rose-500 to-purple-600 relative">
          <Link to="/" className="absolute top-6 left-6 text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Como podemos ajudar?</h1>
          <p className="text-white/80 text-sm">Escolha uma das opções abaixo para entrar em contato com nossa equipe.</p>
        </div>

        <div className="p-6 space-y-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
              <MessageCircle className="text-[#25D366] group-hover:text-white transition-colors" size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Conversar pelo WhatsApp</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Atendimento rápido</p>
            </div>
          </a>

          <a
            href="mailto:contato@presentemagic.com.br"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all dark:hover:bg-blue-500/10 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Mail className="text-blue-500 group-hover:text-white transition-colors" size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Enviar e-mail</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">contato@presentemagic.com.br</p>
            </div>
          </a>

          <Link
            to="/ajuda"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 transition-all dark:hover:bg-purple-500/10 group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <HelpCircle className="text-purple-500 group-hover:text-white transition-colors" size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Central de Ajuda</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dúvidas frequentes</p>
            </div>
          </Link>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:bg-rose-50 transition-all dark:hover:bg-rose-500/10 group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500 transition-colors">
              <Package className="text-rose-500 group-hover:text-white transition-colors" size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Dúvidas sobre pedidos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acompanhe seu presente</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
