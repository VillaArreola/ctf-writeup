import { defineCollection, z } from 'astro:content';

const ctf = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.string(),
    publishedAt: z.date(),
  }),
});

export const collections = {
  ctf,
};
