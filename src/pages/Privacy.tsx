import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 p-6 md:p-12">
      <Helmet>
        <title>Política de Privacidade | Presente Mágico</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 font-medium transition">
          <ArrowLeft size={20} className="mr-2" />
          Voltar para Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 mb-8">
          Política de Privacidade
        </h1>

        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <p>A sua privacidade é importante para nós. É política do <strong>Presente Mágico</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no nosso site.</p>
          
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. Coleta de Dados</h2>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço, como a personalização e envio dos seus produtos. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
          
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. Uso das Informações</h2>
          <p>As informações coletadas são usadas exclusivamente para processar pedidos, realizar entregas e melhorar o nosso atendimento, incluindo o suporte via WhatsApp para dúvidas sobre os presentes.</p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. Compartilhamento de Dados</h2>
          <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. O nosso site pode ter links para sites externos, cujas políticas de privacidade não controlamos.</p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">4. Contato</h2>
          <p>Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, sinta-se à vontade para nos contatar através do nosso WhatsApp oficial de atendimento.</p>
        </div>
      </div>
    </div>
  );
}
