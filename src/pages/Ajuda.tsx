import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getPageById } from '../services/db';
import type { PageData } from '../services/db';
import { 
  Search, Heart, Package, CreditCard, Lock, Image as ImageIcon, 
  Share2, Sparkles, MessageCircle, ChevronDown, Clock, 
  PlayCircle, ArrowRight, ArrowLeft, Mail, CheckCircle2, X 
} from 'lucide-react';

const InstagramIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// DADOS DO FAQ
const FAQ_DATA = [
  {
    question: "Como criar um presente?",
    answer: "Para criar um presente, basta acessar a aba 'Criar' no menu principal, escolher o tema que mais combina com a ocasião (como Amor, Aniversário, Mãe, etc.), preencher as informações carinhosas, adicionar fotos e finalizar. É um processo rápido e intuitivo!"
  },
  {
    question: "Posso editar meu presente depois?",
    answer: "Sim! Se você tiver uma conta e estiver logado, pode acessar 'Meu Painel' e clicar em 'Editar' no presente desejado. Algumas funcionalidades avançadas de edição podem depender do seu plano atual."
  },
  {
    question: "Quanto tempo o link fica disponível?",
    answer: "O tempo de disponibilidade do link depende do plano escolhido. Nos planos gratuitos, o link pode ter uma validade limitada. Nos planos Premium, o link fica disponível para sempre (vitalício)."
  },
  {
    question: "Posso trocar as fotos?",
    answer: "Claro! Acesse a edição do seu presente e vá até a seção de fotos. Lá você pode remover as antigas e fazer o upload de novas fotos a qualquer momento."
  },
  {
    question: "Posso adicionar vídeos?",
    answer: "Sim, os planos Premium permitem a adição de links do YouTube ou upload de pequenos vídeos para tornar o presente ainda mais emocionante."
  },
  {
    question: "Posso colocar música?",
    answer: "Com certeza. Durante a criação, você pode inserir um link do YouTube ou Spotify, e a música tocará como trilha sonora na página do presente."
  },
  {
    question: "O QR Code expira?",
    answer: "Não! O QR Code gerado é fixo e sempre apontará para a página do seu presente. O que pode expirar é a página em si, caso o seu plano não seja vitalício."
  },
  {
    question: "Como compartilhar?",
    answer: "Na tela de sucesso ou visualização do presente, você encontrará botões rápidos para compartilhar no WhatsApp, Instagram, Facebook, E-mail ou simplesmente copiar o link. Você também pode baixar o QR Code."
  },
  {
    question: "Esqueci minha senha. E agora?",
    answer: "Vá para a página de Login e clique em 'Esqueci minha senha'. Enviaremos um link de recuperação para o seu e-mail cadastrado."
  },
  {
    question: "Como cancelar assinatura?",
    answer: "Você pode cancelar sua assinatura a qualquer momento acessando 'Meu Painel', indo na aba 'Configurações' ou 'Planos' e clicando em 'Cancelar Assinatura'."
  },
  {
    question: "Como excluir minha conta?",
    answer: "Para excluir sua conta definitivamente, acesse 'Configurações' no seu Painel, role até o final da página e selecione 'Excluir Conta'. ATENÇÃO: isso apagará todos os seus presentes criados permanentemente."
  }
];

// DADOS DAS DICAS
const TIPS_DATA = [
  {
    id: 1,
    emoji: "💝", 
    title: "Como escrever uma declaração emocionante",
    content: "Escrever do coração é o segredo para uma declaração perfeita. Comece relembrando um momento especial que vocês viveram juntos. Cite detalhes pequenos que só vocês entendem: uma piada interna, uma viagem inesquecível ou a forma como a pessoa sorri.\n\nEvite clichês copiados da internet. Em vez de dizer 'eu te amo mais que tudo', conte *por que* você ama. Diga como a sua vida melhorou desde que essa pessoa chegou. Seja vulnerável, honesto e não se preocupe em parecer um poeta profissional. A emoção verdadeira mora na simplicidade das suas próprias palavras."
  },
  {
    id: 2,
    emoji: "📷", 
    title: "Como escolher as melhores fotos",
    content: "As melhores fotos nem sempre são aquelas com iluminação de estúdio ou ângulos perfeitos. São aquelas que contam uma história.\n\nAo escolher as fotos para o seu presente, tente criar uma linha do tempo. Comece com fotos antigas e vá até as mais recentes. Misture momentos de grandes comemorações com cenas do dia a dia: vocês cozinhando juntos, um momento engraçado com o pet ou uma selfie espontânea no carro.\n\nDica de ouro: inclua sempre uma foto que a pessoa presenteada ache que ela está bonita. Isso demonstra carinho e cuidado!"
  },
  {
    id: 3,
    emoji: "🎵", 
    title: "Qual música combina com cada ocasião",
    content: "A trilha sonora é a alma do seu Presente Mágico. A música certa tem o poder de arrepiar e trazer memórias instantâneas.\n\nAmor/Romântico: Escolha 'a música de vocês'. Aquela que tocou no primeiro encontro ou que vocês sempre cantam no carro.\n\nAniversário de amigos: Músicas animadas, que lembrem festas que vocês foram juntos ou a banda favorita da pessoa.\n\nMães e Pais: Músicas acústicas suaves ou clássicos da época deles. Músicas que falem sobre gratidão e proteção familiar são infalíveis.\n\nHomenagens (Saudade): Músicas instrumentais emocionantes ou canções calmas que tragam paz e boas lembranças."
  },
  {
    id: 4,
    emoji: "🎂", 
    title: "Ideias criativas para aniversários",
    content: "Aniversários são o encerramento de um ciclo e o início de outro. Para fugir do comum, transforme o Presente Mágico em uma 'Cápsula do Tempo' daquele ano.\n\nColoque as melhores fotos dos últimos 365 dias. Na mensagem, liste 3 coisas incríveis que a pessoa conquistou nesse último ano e 3 desejos que você tem para o próximo ciclo dela.\n\nVocê também pode pedir para outros amigos gravarem pequenos vídeos ou mandarem mensagens curtas e incluir tudo isso no presente. Será uma surpresa inesquecível!"
  },
  {
    id: 5,
    emoji: "💍", 
    title: "Ideias para pedidos de casamento",
    content: "O Presente Mágico é a ferramenta perfeita para um pedido de casamento surpresa e tecnológico.\n\nCrie o presente com o tema de Amor. Adicione uma contagem de tempo de 'Desde que nos conhecemos...'. Nas fotos, coloque toda a trajetória do relacionamento.\n\nNo final da mensagem principal, em vez de assinar seu nome, escreva a grande pergunta: 'Você quer casar comigo?'. Gere o QR Code, imprima e coloque dentro de uma caixa de alianças ou no menu do restaurante. Quando ela escanear, a emoção será garantida!"
  },
  {
    id: 6,
    emoji: "👶", 
    title: "Ideias fofas para chá de bebê",
    content: "Um filho muda tudo, e registrar esse momento é um tesouro para o futuro.\n\nSe você for a mãe ou o pai, crie o presente como uma 'Carta para quando você crescer'. Coloque as fotos do ultrassom, do quartinho sendo montado e do barrigão. A música pode ser uma canção de ninar ou algo calmo.\n\nSe você for presentear os pais, faça uma página celebrando a família que está crescendo, com fotos do casal e mensagens de boas-vindas para o bebê. O link vitalício garante que a criança poderá ver essa página daqui a 10 ou 20 anos!"
  },
  {
    id: 7,
    emoji: "🕊️", 
    title: "Como criar uma homenagem eterna",
    content: "Quando alguém querido parte, as memórias são o bem mais precioso que nos resta.\n\nPara criar um memorial, escolha fotos onde a pessoa estava sorrindo, feliz e fazendo o que mais amava. A página deve ser um altar digital de celebração à vida que ela teve.\n\nNa declaração, escreva como se estivesse conversando com a pessoa. Agradeça pelos ensinamentos, relembre os momentos engraçados e reafirme que ela nunca será esquecida. Compartilhe o link do presente com outros familiares para que todos tenham um local digital de conforto e lembrança constante."
  }
];

export default function Ajuda() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatus, setOrderStatus] = useState<null | 'loading' | 'success'>(null);
  const [orderData, setOrderData] = useState<PageData | null>(null);

  const filteredFaq = FAQ_DATA.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (label: string) => {
    if (label === 'Acompanhar pedido') {
      document.getElementById('rastreio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (label === 'Falar com Suporte') {
      document.getElementById('suporte')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    
    setSearchQuery(''); // Clear search filter so all FAQs remain visible
    
    let faqIndex = 0;
    if (label === 'Criar meu presente') faqIndex = 0;
    else if (label === 'Pagamentos') faqIndex = 9; // Como cancelar assinatura
    else if (label === 'Conta e Login') faqIndex = 8; // Esqueci minha senha
    else if (label === 'Fotos e Música') faqIndex = 3; // Posso trocar as fotos
    else if (label === 'Compartilhamento') faqIndex = 7; // Como compartilhar
    else if (label === 'Planos Premium') faqIndex = 2; // Tempo disponível
    
    setOpenFaq(faqIndex);
    
    setTimeout(() => {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleOrderSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery) return;
    
    setOrderStatus('loading');
    
    try {
      const page = await getPageById(orderQuery.trim());
      
      if (page) {
        setOrderData(page);
        setOrderStatus('success');
      } else {
        setOrderStatus(null);
        toast.error("Pedido não encontrado. Verifique o código e tente novamente.");
      }
    } catch (error) {
      setOrderStatus(null);
      toast.error("Erro ao buscar pedido. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-rose-500/30">
      <Helmet>
        <title>Central de Ajuda | Presente Mágico</title>
      </Helmet>

      {/* HEADER SIMPLES */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600">
            Presente Mágico
          </Link>
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-rose-500 transition flex items-center gap-2 font-medium">
            <ArrowLeft size={18} /> Voltar ao site
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-b from-rose-50 to-slate-50 dark:from-slate-900 dark:to-slate-950 transition-colors">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white"
          >
            Como podemos ajudar você?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed"
          >
            Encontre respostas rápidas, acompanhe seus pedidos e fale com nossa equipe sempre que precisar.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={22} />
            </div>
            <input
              type="text"
              placeholder="Pesquise sua dúvida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 md:py-5 rounded-2xl border-2 border-transparent bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none focus:border-rose-500 focus:ring-0 outline-none transition-all text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-24">
        
        {/* CATEGORIAS */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Heart, label: "Criar meu presente", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-500/20" },
              { icon: Package, label: "Acompanhar pedido", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/20" },
              { icon: CreditCard, label: "Pagamentos", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20" },
              { icon: Lock, label: "Conta e Login", color: "text-slate-500", bg: "bg-slate-200 dark:bg-slate-800" },
              { icon: ImageIcon, label: "Fotos e Música", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/20" },
              { icon: Share2, label: "Compartilhamento", color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
              { icon: Sparkles, label: "Planos Premium", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/20" },
              { icon: MessageCircle, label: "Falar com Suporte", color: "text-[#25D366]", bg: "bg-[#25D366]/20" },
            ].map((cat, i) => (
              <motion.button 
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(cat.label)}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-200 dark:hover:border-slate-700 transition-all gap-4 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className={cat.color} size={28} />
                </div>
                <span className="font-semibold text-sm md:text-base text-center text-slate-800 dark:text-slate-200">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          
          {/* FAQ */}
          <section id="faq" className="md:col-span-3 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Dúvidas Frequentes</h2>
            
            {filteredFaq.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <Search className="mx-auto mb-4 opacity-50" size={48} />
                Nenhuma dúvida encontrada para "{searchQuery}".<br/>Tente usar outros termos ou fale com o suporte.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaq.map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-rose-200 dark:hover:border-slate-700 transition-colors">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
                    >
                      <span className={`font-semibold text-lg pr-4 ${openFaq === i ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {faq.question}
                      </span>
                      <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${openFaq === i ? 'bg-rose-100 text-rose-500 dark:bg-rose-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 md:px-6 pb-6 text-slate-600 dark:text-slate-400"
                        >
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SIDEBAR: Rastreio & Suporte */}
          <div className="md:col-span-2 space-y-8">
            
            {/* ACOMPANHAR PEDIDO */}
            <section id="rastreio" className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group scroll-mt-24">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <Package size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Acompanhar Pedido</h3>
              </div>
              
              <form onSubmit={handleOrderSearch} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Digite o código do seu presente
                  </label>
                  <input
                    type="text"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    placeholder="Ex: a1b2c3d4"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-0 outline-none transition-colors text-slate-900 dark:text-white mb-2"
                    required
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-300">💡 Dica:</strong> Você encontra este código de 8 dígitos no final do link do seu presente ou no seu painel.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={orderStatus === 'loading'}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                >
                  {orderStatus === 'loading' ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Consultar Status"
                  )}
                </button>
              </form>

              <AnimatePresence>
                {orderStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Status do Pedido: #{orderQuery}</h4>
                        <p className="text-sm text-slate-500">
                          {orderData?.created_at ? `Criado em ${new Date(orderData.created_at).toLocaleDateString('pt-BR')}` : 'Pedido encontrado!'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 ${orderData?.status === 'pending_payment' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'} rounded-full text-xs font-bold uppercase tracking-wider`}>
                        {orderData?.status === 'pending_payment' ? 'Aguardando Pgto' : 'Pronto'}
                      </div>
                    </div>

                    {/* Timeline do Pedido */}
                    <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-green-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                          <CheckCircle2 size={12} />
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-even:pr-4 md:group-odd:pl-4">
                          <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Pedido Recebido</h5>
                        </div>
                      </div>

                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 ${orderData?.status === 'pending_payment' ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-green-500 text-white'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow`}>
                          {orderData?.status !== 'pending_payment' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-even:pr-4 md:group-odd:pl-4">
                          <h5 className={`font-semibold text-sm ${orderData?.status === 'pending_payment' ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>Pagamento Aprovado</h5>
                        </div>
                      </div>

                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 ${orderData?.status === 'pending_payment' ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-green-500 text-white'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow`}>
                          {orderData?.status !== 'pending_payment' && <CheckCircle2 size={12} />}
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-even:pr-4 md:group-odd:pl-4">
                          <h5 className={`font-semibold text-sm ${orderData?.status === 'pending_payment' ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>Presente Mágico Gerado</h5>
                        </div>
                      </div>
                    </div>

                    {orderData?.status !== 'pending_payment' && (
                      <Link 
                        to={`/v/${orderData?.id}`}
                        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                      >
                        Acessar Presente Mágico
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* FALE CONOSCO */}
            <section id="suporte" className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group scroll-mt-24">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-2xl">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fale Conosco</h3>
              </div>

              <div className="space-y-3">
                <a href="https://wa.me/message/MJ33P725HOFKI1" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#25D366] hover:bg-[#25D366]/5 dark:hover:bg-[#25D366]/10 transition-all group/btn">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover/btn:bg-[#25D366] group-hover/btn:text-white transition-colors">
                    <MessageCircle size={20} />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">WhatsApp</span>
                </a>
                <a href="mailto:contato@presentemagic.com.br" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-all group/btn">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors">
                    <Mail size={20} />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">E-mail</span>
                </a>
                <a href="https://instagram.com/presentemagic" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-500/5 dark:hover:bg-purple-500/10 transition-all group/btn">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover/btn:bg-purple-500 group-hover/btn:text-white transition-colors">
                    <InstagramIcon size={20} />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Instagram</span>
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* TUTORIAIS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tutoriais em Vídeo</h2>
            <button className="text-rose-500 hover:text-rose-600 font-bold flex items-center gap-2 hidden md:flex transition-colors">
              Ver todos os vídeos <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Como criar um presente do zero", 
              "Como compartilhar nas redes", 
              "Como baixar o QR Code",
              "Como editar um presente", 
              "Vantagens do plano Premium", 
              "Como recuperar senha"
            ].map((title, i) => (
              <div 
                key={i} 
                className="group cursor-pointer"
                onClick={() => toast("Tutorial em vídeo estará disponível em breve!", { icon: "🎬" })}
              >
                <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-3xl relative overflow-hidden mb-4 border border-slate-200 dark:border-slate-700">
                  {/* Fundo simulando thumbnail */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${i%2===0 ? 'from-rose-500/20 to-purple-500/20' : 'from-blue-500/20 to-emerald-500/20'}`} />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/40 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PlayCircle className="text-rose-500 ml-1" size={36} />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-rose-500 transition-colors px-2">{title}</h3>
                <p className="text-sm text-slate-500 mt-1 px-2">Tutorial passo a passo</p>
              </div>
            ))}
          </div>
        </section>

        {/* DICAS / BLOG */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-14 border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-purple-600" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-500/20 text-amber-500 rounded-2xl">
              <Sparkles size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Dicas para um presente inesquecível</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl text-lg">
            Inspire-se com nossos artigos exclusivos para tornar a sua homenagem ainda mais emocionante, personalizada e perfeita para quem você ama.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {TIPS_DATA.map((tip, i) => (
              <div 
                key={tip.id} 
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/5 transition-all cursor-pointer group flex flex-col items-start"
                onClick={() => setSelectedTip(i)}
              >
                <div className="text-4xl mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform origin-bottom-left inline-block">{tip.emoji}</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-rose-500 transition-colors text-lg">
                  {tip.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER CTA */}
      <section className="bg-slate-950 py-24 text-center px-4 relative overflow-hidden mt-12">
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Ainda não encontrou sua resposta?</h2>
          <p className="text-slate-400 mb-10 text-xl font-light">"Nossa equipe de especialistas terá um enorme prazer em ajudar você a criar algo mágico."</p>
          <Link 
            to="/contato" 
            className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-rose-500/20 text-lg gap-3"
          >
            <MessageCircle size={24} /> Falar com um Especialista
          </Link>
        </div>
      </section>
      
      {/* Rodapé super simples apenas para esta tela não acabar seca */}
      <footer className="bg-black py-8 text-center border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Presente Mágico. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacidade" className="text-slate-500 hover:text-slate-300 transition">Política de Privacidade</Link>
            <Link to="/contato" className="text-slate-500 hover:text-slate-300 transition">Fale Conosco</Link>
          </div>
        </div>
      </footer>

      {/* TIP MODAL */}
      <AnimatePresence>
        {selectedTip !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedTip(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-purple-600" />
              <button 
                onClick={() => setSelectedTip(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-full transition-colors z-20"
              >
                <X size={20} />
              </button>
              
              <div className="overflow-y-auto p-8 md:p-10">
                <div className="text-6xl mb-6">{TIPS_DATA[selectedTip].emoji}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight pr-8">
                  {TIPS_DATA[selectedTip].title}
                </h2>
                
                <div className="space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {TIPS_DATA[selectedTip].content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
