import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.redirect(302, '/');
  }

  try {
    // 1. Buscar dados do presente no Supabase
    const { data: page, error } = await supabase
      .from('pages')
      .select('data, template')
      .eq('id', id)
      .single();

    if (error || !page) {
      return res.redirect(302, '/');
    }

    // 2. Extrair título e imagem baseados nos dados
    // Tenta achar um nome ou título
    let title = 'Presente Mágico';
    if (page.data.name) title = `Presente para ${page.data.name}`;
    if (page.data.name1 && page.data.name2) title = `Presente para ${page.data.name1} & ${page.data.name2}`;
    
    // Tenta achar a primeira foto enviada
    let imageUrl = 'https://presentemagico.app/og-image.jpg'; // fallback
    if (page.data.photos && page.data.photos.length > 0) {
      imageUrl = page.data.photos[0].url;
    }

    const description = "Você recebeu um presente inesquecível. Clique para abrir sua cápsula do tempo.";

    // 3. Buscar o index.html original do Frontend (Vite)
    // Como estamos na Vercel, o Host está no header
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    
    // Cuidado com loop infinito: pedimos a raiz "/" que não passa por esta função
    const baseUrl = `${protocol}://${host}`;
    
    let html = '';
    try {
      const response = await fetch(baseUrl + '/');
      html = await response.text();
    } catch (fetchErr) {
      console.error("Erro ao fazer fetch do index.html:", fetchErr);
      return res.status(500).send('Internal Server Error');
    }

    // 4. Injetar as Meta Tags OpenGraph no <head>
    const ogTags = `
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

    // Substituir a tag <title> se existir, e adicionar as metas
    let finalHtml = html;
    if (finalHtml.includes('</head>')) {
      finalHtml = finalHtml.replace('</head>', `${ogTags}\n</head>`);
      finalHtml = finalHtml.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
    }

    // 5. Retornar o HTML modificado para o robô do WhatsApp/Facebook ou navegador do usuário
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cache no Edge da Vercel
    return res.status(200).send(finalHtml);

  } catch (err: any) {
    console.error("Erro fatal no SEO handler:", err);
    return res.redirect(302, '/');
  }
}
