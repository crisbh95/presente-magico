import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <Link to="/" className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Termos de Uso</h1>
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Bem-vindo ao Presente Mágico. Ao acessar e utilizar nossa plataforma, você concorda com os termos e condições descritos abaixo.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold mt-8">1. Aceitação dos Termos</h2>
            <p>Ao criar uma conta ou utilizar nossos serviços para criar ou visualizar presentes interativos, você concorda em cumprir estes Termos de Uso e nossa Política de Privacidade. Se você não concorda com alguma parte destes termos, não deve utilizar a plataforma.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold mt-8">2. Responsabilidade sobre o Conteúdo (UGC)</h2>
            <p>O Presente Mágico é uma ferramenta de criação de páginas web interativas. Todo conteúdo de texto, fotos, vídeos ou informações inseridas nos presentes <strong>é de inteira e exclusiva responsabilidade do usuário que os enviou</strong> (conteúdo gerado pelo usuário).</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>O Presente Mágico atua apenas como provedor de infraestrutura técnica e não realiza moderação prévia das mídias enviadas.</li>
              <li>É expressamente proibido o envio de imagens de nudez não consensual, abuso infantil, violência gráfica, discursos de ódio ou qualquer material protegido por direitos autorais que você não tenha licença para usar.</li>
              <li>A plataforma reserva-se o direito de remover sumariamente e sem aviso prévio qualquer página que viole estas regras, após o recebimento de uma denúncia.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold mt-8">3. Canal de Denúncia</h2>
            <p>Se você identificar um presente público contendo material difamatório, ilegal ou não autorizado, utilize o botão de "Denunciar" presente em todas as páginas públicas (ícone de bandeira) ou entre em contato pelo email: contato@presentemagic.com.br informando a URL da página.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold mt-8">4. Assinaturas e Reembolsos</h2>
            <p>O Presente Mágico oferece planos de assinatura (Premium e Agência) processados por parceiros seguros (Mercado Pago). Você pode cancelar a renovação da sua assinatura a qualquer momento através do seu painel.</p>
            <p>Estornos e reembolsos seguem a legislação brasileira do Código de Defesa do Consumidor (Art. 49), garantindo o direito de arrependimento em até 7 dias corridos após a compra, desde que o limite de visualizações dos presentes criados não indique o consumo integral do serviço.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold mt-8">5. Isenção de Garantias</h2>
            <p>O serviço é fornecido "no estado em que se encontra". Embora utilizemos infraestrutura de ponta (CDN e Bancos de Dados em Nuvem) para manter os presentes disponíveis 99.9% do tempo, não nos responsabilizamos por perdas de dados causadas por exclusões acidentais por parte do usuário ou manutenções imprevistas da rede.</p>
          </section>

          <p className="text-sm text-slate-500 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
