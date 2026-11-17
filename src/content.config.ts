import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Copy that is either the same in both modes, or has a Pro and an On Fire voice. */
const variant = z.union([z.string(), z.object({ pro: z.string(), fire: z.string() })]);

const yamlDir = (dir: string) => glob({ pattern: '*.yaml', base: `./src/content/${dir}` });
const yamlFile = (name: string) => glob({ pattern: `${name}.yaml`, base: './src/content' });

const roles = defineCollection({
  loader: yamlDir('roles'),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    type: z.enum(['full-time', 'freelance']),
    start: z.string().regex(/^\d{4}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  }),
});

const achievements = defineCollection({
  loader: yamlDir('achievements'),
  schema: z.object({
    title: z.string(),
    role: reference('roles'),
    specializations: z.array(z.enum(['edtech', 'workforce'])).default([]),
    summary: z.string(),
    /** Numbers live here and only here. `value` is copied exactly from the owner's source of truth. */
    facts: z.array(
      z.object({
        id: z.string(),
        value: z.string(),
        label: z.string().optional(),
        detail: z.string(),
      }),
    ),
    tags: z.array(z.string()).default([]),
    /** Reserved for full case studies (not rendered yet). */
    caseStudy: z.object({ problem: variant, solution: variant, impact: variant }).optional(),
  }),
});

const cards = defineCollection({
  loader: yamlDir('cards'),
  schema: z.object({
    order: z.number(),
    title: variant,
    text: variant,
    /** Proof chips, each as `achievement-id/fact-id`. */
    chips: z.array(z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/)),
  }),
});

const offers = defineCollection({
  loader: yamlDir('offers'),
  schema: z.object({
    order: z.number(),
    title: variant,
    text: variant,
  }),
});

const sections = defineCollection({
  loader: yamlDir('sections'),
  schema: z.object({
    enabled: z.boolean().default(true),
    label: variant.optional(),
    eyebrow: variant.optional(),
    heading: variant.optional(),
    body: variant.optional(),
    /** Longer copy with a different number of paragraphs per voice. */
    paragraphs: z.object({ pro: z.array(z.string()), fire: z.array(z.string()) }).optional(),
    cta: variant.optional(),
    caption: variant.optional(),
    stamp: variant.optional(),
    status: variant.optional(),
    /** A contact-form topic the section's CTA preselects. */
    formTopic: z.string().optional(),
  }),
});

/** Products in the lab: public teasers only. */
const lab = defineCollection({
  loader: yamlDir('lab'),
  schema: z.object({
    order: z.number(),
    codename: z.string(),
    text: variant,
    preview: z.enum(['feed', 'board', 'table']),
  }),
});

const site = defineCollection({
  loader: yamlFile('site'),
  schema: z.object({
    name: z.string(),
    jobTitle: z.string(),
    nameTag: variant,
    wordmark: z.string(),
    meta: z.object({ title: z.string(), description: z.string() }),
    knowsAbout: z.array(z.string()),
    linkedin: z.string().url(),
    calendlyUrl: z.string().url(),
    /** Career-level numbers (not tied to one achievement), copied exactly from the source of truth. */
    facts: z.array(z.object({ id: z.string(), value: z.string(), detail: z.string() })).default([]),
    nav: z.array(z.object({ label: variant, href: z.string() })),
    toggle: z.object({ groupLabel: z.string(), pro: z.string(), fire: z.string() }),
    photoAlt: z.object({ pro: z.string(), fire: z.string() }),
  }),
});

const microcopy = defineCollection({
  loader: yamlFile('microcopy'),
  schema: z.object({
    popup: z.object({
      title: z.string(),
      close: z.string(),
      body: variant,
      stay: variant,
      switch: variant,
    }),
    form: z.object({
      name: variant,
      namePlaceholder: variant,
      email: variant,
      emailPlaceholder: variant,
      topic: variant,
      topics: z.array(z.string()),
      message: variant,
      messagePlaceholder: variant,
      submit: variant,
      success: variant,
      error: variant,
    }),
    calendly: z.object({
      placeholder: variant,
      fallback: variant,
      frameTitle: z.string(),
    }),
    notFound: z.object({ heading: variant, body: variant, cta: variant }),
    thanks: z.object({ heading: variant, cta: variant }),
    hint: z.object({ enabled: z.boolean(), text: variant }),
  }),
});

export const collections = { roles, achievements, cards, offers, sections, lab, site, microcopy };
