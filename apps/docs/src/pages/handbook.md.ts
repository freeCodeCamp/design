import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { stripMdx } from '../lib/strip-mdx';
import { CANONICAL_SITE, resolveSite } from '../lib/site';

const CANONICAL_HOST = new URL(CANONICAL_SITE).host;

export const GET: APIRoute = async context => {
  const site = resolveSite(context);
  const host = new URL(site).host;
  // Foundations prose (voice/typography) carries authored `design.freecodecamp.org`
  // examples. Rewrite to the resolved host so a local dump never points agents at prod.
  const localise = (s: string): string =>
    host === CANONICAL_HOST
      ? s
      : s.split(CANONICAL_SITE).join(site).split(CANONICAL_HOST).join(host);
  const foundations = (await getCollection('foundations')).sort(
    (a, b) => a.data.order - b.data.order
  );

  const lines: string[] = [];
  lines.push('# freeCodeCamp UIKit - Handbook');
  lines.push('');
  lines.push(`HTML: ${site}/handbook`);
  lines.push('');
  lines.push(
    'Design philosophy, palette, typography, spacing, iconography, motion, voice.'
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const entry of foundations) {
    lines.push(`## ${entry.data.title}`);
    lines.push('');
    lines.push(`> ${entry.data.summary}`);
    lines.push('');
    lines.push(localise(stripMdx(entry.body ?? '')));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
