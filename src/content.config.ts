import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = {
  translationKey: z.string(),
  locale: z.enum(['et', 'en']),
};

const sports = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/sports' }),
  schema: z.object({
    ...localized,
    slug: z.string(),
    title: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    definition: z.string(),
    suitedFor: z.array(z.string()),
    startSteps: z.array(z.string()),
    disciplines: z.array(z.string()),
    safety: z.array(z.string()),
    qualification: z.string(),
    competition: z.string(),
    accent: z.enum(['aqua', 'cobalt', 'coral']),
    officialLinks: z.array(
      z.object({
        label: z.string(),
        url: z.url(),
      }),
    ),
  }),
});

const clubs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/clubs' }),
  schema: z.object({
    ...localized,
    name: z.string(),
    summary: z.string(),
    website: z.url(),
    logo: z.string(),
    location: z.string().nullable(),
    sports: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

const documents = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/documents' }),
  schema: z.object({
    id: z.string(),
    locale: z.enum(['et', 'en', 'multi']),
    title: z.string(),
    summary: z.string().optional(),
    category: z.string(),
    documentType: z.enum(['pdf', 'docx', 'xlsx', 'link', 'other']),
    fileUrl: z.string().nullable(),
    fileSize: z.string().optional(),
    version: z.string().optional(),
    adoptedAt: z.string().optional(),
    effectiveFrom: z.string().optional(),
    publishedAt: z.string().nullable(),
    updatedAt: z.string().optional(),
    status: z.enum(['active', 'draft', 'superseded', 'archived']),
    governingBody: z.string().optional(),
    supersedes: z.string().optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    placeholder: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    ...localized,
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    relatedSports: z.array(z.string()).optional(),
    source: z.enum(['website', 'facebook', 'external']).default('website'),
    sourceUrl: z.url().optional(),
    draft: z.boolean().default(true),
  }),
});

const training = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/training' }),
  schema: z.object({
    ...localized,
    title: z.string(),
    type: z.string(),
    level: z.string().nullable(),
    startsAt: z.string().nullable(),
    endsAt: z.string().nullable(),
    registrationDeadline: z.string().nullable(),
    location: z.string().nullable(),
    organizer: z.string().nullable(),
    language: z.string().nullable(),
    volume: z.string().nullable(),
    registrationUrl: z.url().nullable(),
    status: z.enum(['open', 'full', 'ended', 'upcoming']),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { sports, clubs, documents, news, training };
