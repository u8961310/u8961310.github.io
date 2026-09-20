import type { APIRoute } from 'astro';

/**
 * 手寫 sitemap 端點，不裝 @astrojs/sitemap —— 這站只有幾頁，
 * 為此多一個相依不划算。
 *
 * 路由用 glob 從檔案系統推導，之後新增頁面不必回來改這裡。
 */
const EXCLUDE = new Set(['404']);

function routeOf(file: string) {
  // './teaching.astro' -> 'teaching'；'./index.astro' -> ''
  return file
    .replace(/^\.\//, '')
    .replace(/\.astro$/, '')
    .replace(/(^|\/)index$/, '');
}

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs 缺少 site 設定，sitemap 無法產生絕對網址');

  const lastmod = new Date().toISOString().slice(0, 10);

  const routes = Object.keys(import.meta.glob('./**/*.astro'))
    .map(routeOf)
    .filter((r) => !EXCLUDE.has(r))
    .sort();

  const urls = routes
    .map((r) => {
      const loc = new URL(r ? `${r}/` : '', site).href;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
