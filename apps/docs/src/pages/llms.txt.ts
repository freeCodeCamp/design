import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { nonComponentItems } from '../lib/registry';
import { resolveSite } from '../lib/site';

export const GET: APIRoute = async context => {
  const site = resolveSite(context);
  const components = await getCollection('components');
  components.sort((a, b) => a.id.localeCompare(b.id));

  const lines: string[] = [];
  lines.push('# freeCodeCamp UIKit');
  lines.push('');
  lines.push('Dark-first, token-driven, framework-agnostic component library,');
  lines.push(
    'distributed as a copy-source registry: components are copied into your'
  );
  lines.push(
    'project source (shadcn-style) and tailored there - NOT installed from npm.'
  );
  lines.push('');

  lines.push('## Start here');
  lines.push('');
  lines.push(
    `- [Starter guide](${site}/registry/starter.md) - bootstrap a project: theme, fonts, directory layout, AGENTS.md snippet.`
  );
  lines.push(
    `- [Theme](${site}/registry/theme.md) - tokens.css + base.css. Required by every component. Edit token values to recolour; keep token names.`
  );
  lines.push(
    `- [Machine index](${site}/registry/index.json) - every item, its files (raw URLs) and dependencies, as JSON.`
  );
  lines.push('');

  lines.push('## Components');
  lines.push('');
  lines.push(
    'Each page contains install steps, props and the full source (.tsx + .css) to copy.'
  );
  lines.push('');
  for (const c of components) {
    lines.push(
      `- [${c.data.title}](${site}/components/${c.id}.md) - ${c.data.summary}`
    );
  }
  lines.push('');

  lines.push('## Other registry items');
  lines.push('');
  for (const item of nonComponentItems()) {
    lines.push(
      `- [${item.title}](${site}${item.docsPath}) - ${item.description}`
    );
  }
  lines.push('');

  lines.push('## Human surfaces');
  lines.push('');
  lines.push(`- [Landing](${site}/) - overview + quickstart.`);
  lines.push(
    `- [Playground](${site}/playground) - every component, paired code.`
  );
  lines.push(
    `- [Handbook](${site}/handbook) - design philosophy, tokens, brand, install, CDN, Tailwind, recipes, contributing.`
  );
  lines.push('');

  lines.push('## Concatenated dump');
  lines.push('');
  lines.push(
    `- [llms-full.txt](${site}/llms-full.txt) - every component page incl. full source, single file.`
  );
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
