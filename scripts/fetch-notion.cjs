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

async function downloadAndConvertToWebP(url, slug) {
  if (!url.startsWith('http')) return '';
  const imgDir = path.join('public', 'images', 'ctf');
  const outputPath = path.join(imgDir, `${slug}.webp`);

  const exists = await fs.stat(outputPath).then(() => true).catch(() => false);
  if (exists) return `/images/ctf/${slug}.webp`;

  const res = await fetch(url);
  if (!res.ok) return '';

  const buffer = await res.arrayBuffer();
  await fs.mkdir(imgDir, { recursive: true });

  await sharp(Buffer.from(buffer))
    .resize({ width: 800 })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return `/images/ctf/${slug}.webp`;
}

async function fetchWriteups() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Select',
          select: { equals: 'Published' },
        },
        {
          property: 'Date',
          date: { is_not_empty: true },
        },
      ],
    },
  });

  const validSlugs = [];

  for (const page of response.results) {
    try {
      const md = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(md);

      const titleField = page.properties.Title || page.properties.Name;
      const titleProp = titleField?.title;
      const title = Array.isArray(titleProp) && titleProp.length > 0 ? titleProp[0].plain_text : 'Sin título';

      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ?? null;
      if (!slug) continue;

      validSlugs.push(slug);

      const platform = page.properties.Platform?.select?.name ?? 'sin-plataforma';
      const date = new Date(page.properties.Date?.date?.start ?? '2025-01-01').toISOString();

      const fileObj = page.properties["Files & media"]?.files?.[0];
      const imageUrl = fileObj?.type === 'file'
        ? fileObj.file.url
        : fileObj?.external?.url ?? '';

      const localImagePath = imageUrl ? await downloadAndConvertToWebP(imageUrl, slug) : '';

      const frontmatter = [
        '---',
        `title: "${title}"`,
        `platform: "${platform}"`,
        `publishedAt: ${date.split('T')[0]}`,
        `cover: "${localImagePath}"`,
        '---\n',
      ].join('\n');

      const filePath = path.join(CONTENT_DIR, `${slug}.md`);
      await fs.writeFile(filePath, frontmatter + mdString.parent);
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
