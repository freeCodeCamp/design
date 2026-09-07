import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

export const collections = {
  components: defineCollection({
    loader: file('./src/data/components.json'),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      category: z.string(),
      a11yPattern: z.url().optional(),
      order: z.number().optional()
    })
  }),
  guide: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/guide' }),
    schema: z.object({ title: z.string(), description: z.string() })
  })
};
