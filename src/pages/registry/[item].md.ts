import type { APIRoute, GetStaticPaths } from 'astro';
import { nonComponentItems, type RegistryItem } from '../../lib/registry';
import { renderItemPage } from '../../lib/registry-md';
import { resolveSite } from '../../lib/site';

export const getStaticPaths: GetStaticPaths = () =>
  nonComponentItems().map(item => ({
    params: { item: item.name },
    props: { item }
  }));

export const GET: APIRoute = context => {
  const { item } = context.props as { item: RegistryItem };
  return new Response(renderItemPage(item, resolveSite(context)), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
