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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Editar Textos do Presente</h1>
          <p className="text-slate-500 mb-8">Faça correções ortográficas ou mude a mensagem do seu presente.</p>

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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                  </label>
                  {isLongText ? (
                    <textarea 
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={5}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all resize-none"
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-4 ring-primary/20 transition-all"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
