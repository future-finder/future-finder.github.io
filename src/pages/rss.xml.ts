import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/data/site';

export async function GET(context: { site?: URL }) {
  if (!siteConfig.siteUrl && !context.site) {
    return new Response('RSS requires SITE_URL to be configured before deployment.', { status: 404 });
  }
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const base = import.meta.env.BASE_URL;
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.siteUrl,
    items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `${base}blog/${post.id}/`, categories: post.data.tags })),
  });
}
