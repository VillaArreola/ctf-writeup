import { getCollection } from 'astro:content';

export async function GET() {
  try {
    const ctfPosts = await getCollection('ctf');
    
    // URLs estáticas del sitio
    const staticPages = [
      {
        url: 'https://ctf.villaarreola.com/',
        priority: 1.0,
        changefreq: 'weekly'
      },
      {
        url: 'https://ctf.villaarreola.com/ctf/thm',
        priority: 0.9,
        changefreq: 'weekly'
      },
      {
        url: 'https://ctf.villaarreola.com/ctf/htb',
        priority: 0.9,
        changefreq: 'weekly'
      }
    ];

    // URLs dinámicas de los CTF posts
    const ctfUrls = ctfPosts.map(post => ({
      url: `https://ctf.villaarreola.com/ctf/${post.slug}`,
      lastmod: post.data.publishedAt.toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    }));

    // Generar XML del sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${ctfUrls.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap con solo páginas estáticas
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ctf.villaarreola.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ctf.villaarreola.com/ctf/thm</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ctf.villaarreola.com/ctf/htb</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  }
}
