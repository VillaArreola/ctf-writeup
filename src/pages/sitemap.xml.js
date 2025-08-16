import { getCollection } from 'astro:content';

export async function GET() {
  const ctfPosts = await getCollection('ctf');
  
  // URLs estáticas del sitio
  const staticPages = [
    'https://ctf.villaarreola.com/',
    'https://ctf.villaarreola.com/ctf/thm',
    'https://ctf.villaarreola.com/ctf/htb'
  ];

  // URLs dinámicas de los CTF posts
  const ctfUrls = ctfPosts.map(post => ({
    url: `https://ctf.villaarreola.com/ctf/${post.slug}`,
    lastmod: post.data.publishedAt,
    changefreq: 'monthly',
    priority: 0.8
  }));

  // Generar XML del sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
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
      'Content-Type': 'application/xml'
    }
  });
}
