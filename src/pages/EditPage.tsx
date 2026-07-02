import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPageById, updatePage } from '../services/db';
import type { PageData } from '../services/db';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<PageData | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPage() {
      if (!id || !user) return;
      const data = await getPageById(id);
      if (data && data.user_id === user.id) {
        setPage(data);
        // Filtramos apenas campos de texto para edição simples
        const editableData = { ...data.data };
        delete editableData.photos; // Não permitimos edição de mídia nesta view simplificada
        setFormData(editableData);
      } else {
        toast.error("Página não encontrada ou sem permissão.");
        navigate('/dashboard');
      }
      setLoading(false);
    }
    loadPage();
  }, [id, user, navigate]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!page || !user || !id) return;
    setSaving(true);
    
    // Mesclamos os dados editados com os dados originais (para manter as fotos intactas)
    const updatedData = { ...page.data, ...formData };
    
    try {
      await updatePage(id, user.id, updatedData);
      toast.success("Presente atualizado com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
      <div className="max-w-2xl mx-auto relative z-10">
        <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </button>

        <div className="glass rounded-3xl p-8 border border-white/10 shadow-[0_0_30px_rgba(255,0,127,0.1)]">
          <h1 className="text-2xl font-bold mb-2">Editar Textos do Presente</h1>
          <p className="text-white/50 mb-8">Faça correções ortográficas ou mude a mensagem do seu presente.</p>

          <div className="space-y-6">
            {Object.entries(formData).map(([key, value]) => {
              // Se não for string, ignoramos (por segurança)
              if (typeof value !== 'string') return null;

              // Traduzir alguns labels comuns para ficar bonito
              const labelMap: Record<string, string> = {
                name: 'Nome',
                name1: 'Nome 1',
                name2: 'Nome 2',
                message: 'Mensagem',
                date: 'Data',
                time: 'Horário',
                address: 'Endereço',
                course: 'Curso',
                age: 'Idade',
                petName: 'Nome do Pet'
              };
              
              const label = labelMap[key] || (key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim());
              const isLongText = key === 'message' || value.length > 50;

              return (
                <div key={key}>
                  <label className="block text-sm font-bold text-white mb-2">
                    {label}
                  </label>
                  {isLongText ? (
                    <textarea 
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all resize-none text-white placeholder-white/40"
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all text-white placeholder-white/40"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex justify-end gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-bold text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/30"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Alterações</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
