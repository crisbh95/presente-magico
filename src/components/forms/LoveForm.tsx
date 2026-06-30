import { Sparkles } from 'lucide-react';

interface LoveFormProps {
  data: any;
  onChange: (data: any) => void;
  onGenerateAI: () => void;
}

export default function LoveForm({ data, onChange, onGenerateAI }: LoveFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Personalize sua História de Amor</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nome do Casal</label>
          <input
            type="text"
            value={data.coupleName || ''}
            onChange={(e) => onChange({...data, coupleName: e.target.value})}
            placeholder="Ex: João e Maria"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Data de Início do Relacionamento</label>
          <input
            type="date"
            value={data.startDate || ''}
            onChange={(e) => onChange({...data, startDate: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Local onde se conheceram</label>
        <input
          type="text"
          value={data.metLocation || ''}
          onChange={(e) => onChange({...data, metLocation: e.target.value})}
          placeholder="Ex: Na faculdade, no barzinho..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-medium">Sua Carta de Amor</label>
          <button 
            type="button"
            onClick={onGenerateAI}
            className="text-xs font-semibold px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors"
          >
            <Sparkles className="h-3 w-3" /> Gerar com IA
          </button>
        </div>
        <textarea
          rows={6}
          value={data.loveLetter || ''}
          onChange={(e) => onChange({...data, loveLetter: e.target.value})}
          placeholder="Escreva algo com o coração..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Link da Música Favorita (YouTube/Spotify)</label>
        <input
          type="url"
          value={data.musicLink || ''}
          onChange={(e) => onChange({...data, musicLink: e.target.value})}
          placeholder="Ex: https://youtube.com/watch?v=..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 ml-1">💡 Dica: Cole o link de um vídeo do YouTube para tocar a música inteira!</p>
      </div>
    </div>
  );
}
