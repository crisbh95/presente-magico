import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { getPageById, incrementPageViews } from '../services/db';
import GiftViewer from '../components/GiftViewer';

export default function ViewPage() {
  const { id } = useParams();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const counted = useRef(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const data = await getPageById(id);
        if (data) {
          setPageData({ ...data.data, template: data.template });
          if (!counted.current) {
            counted.current = true;
            incrementPageViews(id);
          }
        } else setError(true);
      } catch (err) { setError(true); } finally { setLoading(false); }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4"><Loader2 className="animate-spin text-rose-500 w-12 h-12" /></div>;
  if (error || !pageData) return <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4 text-white"><Heart className="text-white/20 w-16 h-16 mb-4" /><h2 className="text-2xl font-bold">Presente não encontrado</h2></div>;

  return <GiftViewer pageData={pageData} />;
}
