import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const locale = z.enum(['zh', 'en']).default('zh');

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    locale,
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['seed', 'growing', 'evergreen']),
    draft: z.boolean().default(false),
    locale,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    year: z.number().optional(),
    status: z.enum(['active', 'completed', 'reproduction', 'learning', 'archived', 'planned']),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    links: z.object({
      code: z.url().optional(),
      paper: z.url().optional(),
      notes: z.url().optional(),
    }).optional(),
    locale,
  }),
});

export const collections = { blog, notes, projects };
