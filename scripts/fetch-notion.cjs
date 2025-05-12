const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const sharp = require('sharp');
const fs = require('fs').promises;
require('dotenv').config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DB;
const CONTENT_DIR = path.join('src', 'content', 'ctf');

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function downloadAndConvertToWebP(url, filename) {
  if (!url.startsWith('http')) return '';
  const imgDir = path.join('public', 'images', 'ctf');
  const outputPath = path.join(imgDir, filename);
  const exists = await fs.stat(outputPath).then(() => true).catch(() => false);
  if (exists) return `/images/ctf/${filename}`;

  const res = await fetch(url);
  if (!res.ok) return '';

  const buffer = await res.arrayBuffer();
  await fs.mkdir(imgDir, { recursive: true });
  await sharp(Buffer.from(buffer)).resize({ width: 800 }).webp({ quality: 80 }).toFile(outputPath);

  return `/images/ctf/${filename}`;
}

async function fetchWriteups() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        { property: 'Select', select: { equals: 'Published' } },
        { property: 'Date', date: { is_not_empty: true } },
      ],
    },
  });

  const validSlugs = [];

  for (const page of response.results) {
   // console.log('🔍 Propiedades de la página:', JSON.stringify(page.properties, null, 2));
    //console.log('---');
    try {
      const md = await n2m.pageToMarkdown(page.id);
      let content = n2m.toMarkdownString(md).parent;

      const titleField = page.properties.Title || page.properties.Name;
      const titleProp = titleField?.title;
      const title = Array.isArray(titleProp) && titleProp.length > 0 ? titleProp[0].plain_text : 'Sin título';

      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ?? null;
      if (!slug) continue;

      validSlugs.push(slug);

      const platform = page.properties.Platform?.select?.name ?? 'sin-plataforma';
      const date = new Date(page.properties.Date?.date?.start ?? '2025-01-01').toISOString();
      const preview = page.properties.Preview?.rich_text?.[0]?.plain_text ?? 'Sin descripción';
      const tags = page.properties.Tags?.multi_select?.map(tag => tag.name) ?? [];
      const link = page.properties.link?.rich_text?.[0]?.plain_text ?? 'Sin link'; 

      const fileObj = page.properties['Files & media']?.files?.[0];
      const imageUrl = fileObj?.type === 'file' ? fileObj.file.url : fileObj?.external?.url ?? '';
      const coverImagePath = imageUrl ? await downloadAndConvertToWebP(imageUrl, `${slug}-cover.webp`) : '';

      const imageMatches = [...content.matchAll(/!\[(.*?)\]\((https:\/\/prod-files-secure.*?)\)/g)];
      for (let i = 0; i < imageMatches.length; i++) {
        const altText = imageMatches[i][1];
        const imgUrl = imageMatches[i][2];
        const imageName = `${slug}-${i}.webp`;
        const localPath = await downloadAndConvertToWebP(imgUrl, imageName);
        content = content.replace(imgUrl, localPath);
      }
        // Detectar encabezados ## en el contenido
        const headings = [...content.matchAll(/^##\s+(.*)/gm)].map(h => {
          const text = h[1].trim();
          const id = text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')       // elimina acentos
          .replace(/[^a-z0-9\s-]/g, '')          // quita emojis y símbolos raros
          .trim()
          .replace(/\s+/g, '-')                  // espacios → guiones
          .replace(/^-+|-+$/g, '');              // quita guiones al inicio y fin

          return { text, id };
        });

        const tocYaml = headings.length > 0
          ? `toc:\n${headings.map(h => `  - text: "${h.text}"\n    id: "${h.id}"`).join('\n')}`
          : '';

        const frontmatter = [
          '---',
          `title: "${title}"`,
          `platform: "${platform}"`,
          `publishedAt: ${date.split('T')[0]}`,
          `cover: "${coverImagePath}"`,
          `preview: "${preview}"`,
          `tags: [${tags.join(', ')}]`,
          `link: "${link}"`,
          tocYaml,
          '---\n',
        ].join('\n');

      const filePath = path.join(CONTENT_DIR, `${slug}.md`);
      await fs.writeFile(filePath, frontmatter + content);
      console.log(`✅ ${slug}.md generado`);
    } catch (error) {
      console.error(`❌ Error en "${page.id}":`, error.message);
    }
  }

  const allFiles = await fs.readdir(CONTENT_DIR);
  const filesToDelete = allFiles.filter((file) => {
    const slug = file.replace('.md', '');
    return !validSlugs.includes(slug);
  });

  for (const file of filesToDelete) {
    const filePath = path.join(CONTENT_DIR, file);
    await fs.unlink(filePath);
    console.log(`🗑️  ${file} eliminado (no está publicado)`);
  }
}

fetchWriteups();
