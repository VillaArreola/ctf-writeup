const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DB;
const CONTENT_DIR = path.join('src', 'content', 'ctf');

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function fetchWriteups() {
  // 1. Consulta solo los posts publicados
    const response = await notion.databases.query({
  database_id: DATABASE_ID,
  filter: {
    and: [
      {
        property: 'Select', 
        select: {
          equals: 'Published',
        },
      },
      {
        property: 'Date',
        date: {
          is_not_empty: true,
        },
      },
    ],
  },
});



  // 2. Extraer slugs válidos desde Notion
  const validSlugs = [];
console.log(`📄 Entradas encontradas: ${response.results.length}\n`);
  for (const page of response.results) {
    try {
      const md = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(md);

      const titleField = page.properties.Title || page.properties.Name;
      const titleProp = titleField?.title;
      const title = Array.isArray(titleProp) && titleProp.length > 0
        ? titleProp[0].plain_text
        : 'Sin título';

      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ?? null;
      if (!slug) continue;

      validSlugs.push(slug); // ✅ Lo agregamos a la lista de slugs válidos

      const platform = page.properties.Platform?.select?.name ?? 'sin-plataforma';
      const date = new Date(page.properties.Date?.date?.start ?? '2025-01-01').toISOString();


      const frontmatter = [
        '---',
        `title: "${title}"`,
        `platform: "${platform}"`,
        `publishedAt: ${date.split('T')[0]}`,
        '---\n',
      ].join('\n');

      const filePath = path.join(CONTENT_DIR, `${slug}.md`);
      await fs.writeFile(filePath, frontmatter + mdString.parent);
      console.log(`✅ ${slug}.md generado`);
    } catch (error) {
      console.error(`❌ Error procesando entrada:`, error);
    }
  }

  // 3. Leer todos los archivos .md en el directorio
  const allFiles = await fs.readdir(CONTENT_DIR);
  const filesToDelete = allFiles.filter((file) => {
    const slug = file.replace('.md', '');
    return !validSlugs.includes(slug);
  });

  // 4. Eliminar los que ya no están publicados
  for (const file of filesToDelete) {
    const filePath = path.join(CONTENT_DIR, file);
    await fs.unlink(filePath);
    console.log(`🗑️  ${file} eliminado (no está publicado)`);
  }
}

fetchWriteups();
