import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { renderComponentPage } from '../../lib/registry-md';
import { resolveSite } from '../../lib/site';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getCollection('components')).map(entry => ({
    params: { slug: entry.id },
    props: { entry }
  }));

export const GET: APIRoute = context => {
  const { entry } = context.props as { entry: CollectionEntry<'components'> };
  return new Response(
    renderComponentPage(
      { slug: entry.id, ...entry.data },
      resolveSite(context)
    ),
    {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
    }
  );
};
