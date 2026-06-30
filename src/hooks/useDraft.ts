import { useState, useEffect } from 'react';

/**
 * Hook para salvar o progresso dos formulários (Wizards) no localStorage.
 * @param key Chave única para identificar o rascunho (ex: 'draft_mae')
 * @param initialData Os dados iniciais do formulário
 */
export function useDraft<T>(key: string, initialData: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Erro ao ler rascunho", e);
    }
    return initialData;
  });

  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setHasRestored(true);
      }
    } catch (e) {}
  }, [key]);

  // Salva no localStorage toda vez que 'data' muda
  useEffect(() => {
    try {
      // Ignoramos arquivos (File) no rascunho porque eles não são serializáveis no JSON.stringify
      const dataToSave = { ...data };
      
      // Limpeza de campos não serializáveis (Files). 
      for (const k in dataToSave) {
        if (Array.isArray(dataToSave[k])) {
          (dataToSave as any)[k] = (dataToSave[k] as any).map((item: any) => {
            if (item && typeof item === 'object' && item.file instanceof File) {
              return { ...item, file: null, preview: item.preview }; 
            }
            return item;
          });
        }
      }

      localStorage.setItem(key, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Falha ao salvar rascunho no localStorage", e);
    }
  }, [data, key]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  };

  return { data, setData, hasRestored, clearDraft };
}
