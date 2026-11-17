// /llms.txt: a plain-text summary for AI agents and language models, built
// from the same content files as the page (Pro voice, facts in full).

import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { pick, plain } from '../lib/text';

const month = (value: string | null) =>
  value === null
    ? 'present'
    : new Date(`${value}-01T00:00:00Z`).toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const GET: APIRoute = async ({ site: origin }) => {
  const site = (await getEntry('site', 'site'))!.data;
  const hero = (await getEntry('sections', 'hero'))!.data;
  const about = (await getEntry('sections', 'about'))!.data;
  const lab = (await getCollection('lab')).sort((a, b) => a.data.order - b.data.order);
  const offers = (await getCollection('offers')).sort((a, b) => a.data.order - b.data.order);
  const roles = (await getCollection('roles')).sort((a, b) => b.data.start.localeCompare(a.data.start));
  const achievements = await getCollection('achievements');
  const roleById = new Map(roles.map((role) => [role.id, role.data]));

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.meta.description}`,
    '',
    `${site.jobTitle}. ${plain(pick(hero.heading))} ${plain(pick(hero.body))}`,
    '',
    ...(about.enabled && about.paragraphs ? ['## About', '', ...about.paragraphs.pro.flatMap((p) => [plain(p), ''])] : []),
    'This site has two modes with identical facts: Pro (default) and On Fire (same facts, more playful wording).',
    'This file uses the Pro wording.',
    '',
    '## Experience',
    '',
    ...roles.map((r) => `- ${r.data.title}, ${r.data.company} (${month(r.data.start)} to ${month(r.data.end)}, ${r.data.type})`),
    '',
    '## Achievements',
    '',
    ...achievements.flatMap((a) => {
      const role = roleById.get(a.data.role.id);
      return [
        `### ${a.data.title}`,
        role ? `${role.title}, ${role.company}` : '',
        '',
        a.data.summary,
        '',
        ...a.data.facts.map((f) => `- ${f.detail}`),
        '',
      ];
    }),
    '## In the lab (in progress)',
    '',
    ...lab.map((item) => `- ${item.data.codename}: ${plain(pick(item.data.text))}`),
    '',
    '## What I offer',
    '',
    ...offers.map((o) => `- ${plain(pick(o.data.title))}: ${plain(pick(o.data.text))}`),
    '',
    '## Contact',
    '',
    `- Contact form: ${new URL('/#contact', origin).href}`,
    `- Book a 30 minute call: ${site.calendlyUrl}`,
    `- LinkedIn: ${site.linkedin}`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
