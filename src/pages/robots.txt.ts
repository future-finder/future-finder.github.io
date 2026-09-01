import { siteConfig } from '@/data/site';
export function GET() {
  const base = import.meta.env.BASE_URL.replace(/^\//, '').replace(/\/$/, '');
  const sitemapPath = base ? `${base}/sitemap-index.xml` : 'sitemap-index.xml';
  const sitemap = siteConfig.siteUrl ? `\nSitemap: ${siteConfig.siteUrl.replace(/\/$/, '')}/${sitemapPath}` : '';
  return new Response(`User-agent: *\nAllow: /${sitemap}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
