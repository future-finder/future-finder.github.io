import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/data/site';

export async function GET(context: { site?: URL }) {
  if (!siteConfig.siteUrl && !context.site) {
    return new Response('RSS requires SITE_URL to be configured before deployment.', { status: 404 });
  }
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const base = import.meta.env.BASE_URL;
  const research = await getCollection('research');
  const notes = (await getCollection('notes')).filter((note) => !note.data.draft);
  const projects = await getCollection('projects');
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.siteUrl,
    items: [
      ...posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `${base}blog/${post.id}/`, categories: post.data.tags })),
      ...research.map((entry) => ({ title: entry.data.title, description: entry.data.description, link: `${base}research/${entry.id}/`, categories: entry.data.tags })),
      ...notes.map((entry) => ({ title: entry.data.title, description: entry.data.description, link: `${base}notes/${entry.id}/`, categories: entry.data.tags })),
      ...projects.filter((entry) => entry.id !== 'lettuce-detect').map((entry) => ({ title: entry.data.title, description: entry.data.description, link: `${base}projects/${entry.id}/`, categories: entry.data.tags })),
    ],
  });
}
