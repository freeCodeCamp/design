/**
 * Machine-readable registry index. One fetch gives an agent every item,
 * its files (raw URLs), npm deps and registry deps.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  componentItem,
  iconSvgNames,
  nonComponentItems,
  registryVersion,
  type RegistryItem
} from '../../lib/registry';
import { resolveSite } from '../../lib/site';

function serialize(item: RegistryItem, site: string) {
  return {
    name: item.name,
    kind: item.kind,
    title: item.title,
    ...(item.category ? { category: item.category } : {}),
    description: item.description,
    npmDependencies: item.npmDependencies,
    registryDependencies: item.registryDependencies,
    files: item.files.map(f => ({
      name: f.name,
      target: f.target,
      url: `${site}${f.url}`
    })),
    docs: `${site}${item.docsPath}`
  };
}

export const GET: APIRoute = async context => {
  const site = resolveSite(context);
  const components = await getCollection('components');
  components.sort((a, b) => a.id.localeCompare(b.id));

  const items = [
    ...components
      .map(entry =>
        componentItem(entry.id, {
          title: entry.data.title,
          summary: entry.data.summary,
          category: entry.data.category
        })
      )
      .filter((item): item is RegistryItem => item !== null),
    ...nonComponentItems()
  ];

  const body = {
    name: 'freecodecamp-uikit',
    homepage: site,
    version: registryVersion(),
    llms: `${site}/llms.txt`,
    starter: `${site}/registry/starter.md`,
    icons: {
      names: iconSvgNames(),
      svgUrlTemplate: `${site}/registry/icons/svg/{name}.svg`
    },
    items: items.map(item => serialize(item, site))
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};
