import { defineCollection, z } from 'astro:content';

const ctf = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.string(),
    publishedAt: z.date(),
    cover: z.string().optional(),   // 👈 esto debe estar
    preview: z.string().optional(), // si también estás usando `preview`
  }),
});

export const collections = {
  ctf,
};
