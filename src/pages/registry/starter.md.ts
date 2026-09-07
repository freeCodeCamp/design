import type { APIRoute } from 'astro';
import { publicFontNames, registryVersion } from '../../lib/registry';
import { resolveSite } from '../../lib/site';

export const GET: APIRoute = context => {
  const site = resolveSite(context);
  return new Response(
    [
      '# Set up freeCodeCamp components',
      'Use a React + TypeScript project. Components are copied source; no freeCodeCamp package is required. Individual components declare any other packages they need.',
      `1. Copy ${site}/registry/theme/tokens.css and ${site}/registry/theme/base.css into src/ui/theme/.`,
      '2. Import tokens.css and base.css from your application entry, before component CSS.',
      '3. Download the fonts below into public/fonts/, or change the font declarations in your copied tokens.css.',
      ...publicFontNames().map(name => `- ${site}/fonts/${name}`),
      `4. Choose a component at ${site}/playground or ${site}/llms.txt. Its Markdown includes full source, an example, file destinations, shared source, and external dependencies.`,
      '5. Copy to the indicated destinations. Update relative imports if you change the layout. Import component CSS once.',
      'Dark is the default. Add light-palette to the root element for light mode. Use CSS variables to customize the theme.',
      `Source revision: ${registryVersion()}. Keep the source license: ${site}/license.txt. Copied files do not update automatically.`,
      `Design guide: ${site}/handbook.md`,
      ''
    ].join('\n\n'),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } }
  );
};
