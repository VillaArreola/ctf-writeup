# Notion to Astro Writeups

> Crea tu blog técnico con Astro y Notion como CMS, ideal para writeups de CTFs, labs y proyectos de ciberseguridad.

## ✨ Características

- Astro + TailwindCSS + Markdown
- Notion como CMS sin necesidad de headless CMS externo
- Descarga automática de contenido y portadas
- Generación estática (SSG)
- Diseño estilo terminal oscuro y responsive

## 🔄 Flujo de trabajo

1. Escribes en Notion
2. Ejecutas `npm run update-site`
3. Astro convierte el contenido y lo construye

## 📂 Estructura

```
/
├── public/
│   └── images/ctf/             # Imágenes convertidas desde Notion
├── scripts/
│   └── fetch-notion.cjs       # Script para descargar y procesar el contenido
├── src/
│   ├── content/ctf/           # Archivos .md generados desde Notion
│   ├── layouts/               # Layouts para páginas y plataformas
│   ├── components/            # Navbar, footer, buscador...
│   └── pages/                 # Index + rutas dinámicas Astro
└── .env                       # Claves privadas
```

## 🚀 Instalación

```bash
git clone https://github.com/villaarreola/notion-to-astro-md.git
cd notion-to-astro-md
npm install
```

## 🔐 Variables de entorno `.env`

```
NOTION_TOKEN=tu_token
NOTION_DB=tu_database_id
```

## 📅 Uso diario

```bash
npm run update-site  # Sincroniza Notion y hace build
npm run dev          # Servidor local
```

## 🌟 Inspirado en
- Astro
- Notion
- Hack The Box, TryHackMe, y writeups de la comunidad

## 🙌 Autor
**Villa Arreola** - [villaarreola.com](https://villaarreola.com)

---

❤️ Star este repo si te ayudó.

📢 PRs y mejoras bienvenidas.
