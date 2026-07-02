import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
      <Helmet>
        <title>Política de Privacidade | Presente Mágico</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-4xl mx-auto glass rounded-3xl shadow-[0_0_30px_rgba(255,0,127,0.1)] p-8 md:p-12 border border-white/10 relative z-10">
        <Link to="/" className="inline-flex items-center text-white/50 hover:text-white mb-8 font-medium transition">
          <ArrowLeft size={20} className="mr-2" />
          Voltar para Home
        </Link>

        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 mb-8">
          Política de Privacidade
        </h1>

        <div className="space-y-6 text-white/70 leading-relaxed text-lg">
          <p>A sua privacidade é importante para nós. É política do <strong>Presente Mágico</strong> respeitar a sua privacidade e garantir total conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.</p>
          
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Coleta de Dados e Consentimento</h2>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer nossos serviços, como a criação, personalização e hospedagem dos presentes mágicos. Nós o fazemos por meios justos e legais, com o seu pleno conhecimento e consentimento, através de caixas de aceitação visíveis em nossos formulários.</p>
          
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Uso das Informações</h2>
          <p>As informações (como fotos, nomes, datas e textos) coletadas são usadas exclusivamente para a exibição no presente criado e para melhorar o nosso atendimento. Não utilizamos seus dados pessoais ou imagens carregadas para nenhuma outra finalidade comercial alheia ao seu presente.</p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Compartilhamento de Dados</h2>
          <p>Não compartilhamos, vendemos ou alugamos informações de identificação pessoal ou fotos com terceiros, exceto quando exigido por lei.</p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Direitos do Titular (Exclusão de Dados)</h2>
          <p>De acordo com a LGPD, você possui controle sobre seus dados. Você tem o direito de solicitar a alteração ou a exclusão completa dos seus dados e fotos a qualquer momento. Para exercer esse direito, basta acessar o painel de controle (Dashboard) e excluir o presente gerado, ou excluir sua conta por completo. Ao excluir sua conta, todas as fotos, textos e presentes vinculados são apagados permanentemente de nossos servidores.</p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Contato e Encarregado de Dados</h2>
          <p>Se você tiver alguma dúvida sobre como lidamos com dados e informações pessoais, ou se desejar exercer seus direitos da LGPD, sinta-se à vontade para nos contatar através do nosso suporte.</p>
        </div>
      </div>
    </div>
  );
}
