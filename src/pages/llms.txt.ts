import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { nonComponentItems } from '../lib/registry';
import { resolveSite } from '../lib/site';

export const GET: APIRoute = async context => {
  const site = resolveSite(context);
  const components = (await getCollection('components')).sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );
  return new Response(
    [
      '# freeCodeCamp Design: Command-line Chic',
      '> Design guidance and copyable React + TypeScript components with ordinary CSS.',
      'Read the relevant component document before adapting it. Each document contains source, shared dependencies, styles, an example, and copy destinations. No freeCodeCamp SDK is required. Preserve semantics and keyboard behavior; check the result in the consuming project.',
      '## Start here',
      `- [Style guide](${site}/handbook.md): Brand, typography, color, layout, and interaction guidance.`,
      `- [Setup](${site}/registry/starter.md): Theme, fonts, and how to copy components.`,
      `- [Manifest](${site}/registry/index.json): Source file URLs, destinations, and dependencies.`,
      '## Components',
      ...components.map(
        entry =>
          `- [${entry.data.title}](${site}/components/${entry.id}.md): ${entry.data.summary}`
      ),
      '## Shared source',
      ...nonComponentItems().map(
        item =>
          `- [${item.title}](${site}${item.docsPath}): ${item.description}`
      ),
      '## Website',
      `- [Overview](${site}/): Introduction to the system.`,
      `- [Style guide](${site}/handbook): Human-readable guide and brand downloads.`,
      `- [Playground](${site}/playground): Interactive previews and source copying.`,
      ''
    ].join('\n\n'),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } }
  );
};
