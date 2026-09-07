import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { resolveSite } from '../lib/site';

export const GET: APIRoute = async context => {
  const entry = await getEntry('guide', 'style-guide');
  if (!entry) throw new Error('Style guide missing');
  const site = resolveSite(context);
  const body = (entry.body ?? '')
    .replace(/\]\(\//g, `](${site}/`)
    .replace(/src="\//g, `src="${site}/`);
  return new Response(`# ${entry.data.title}\n\n${body}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
