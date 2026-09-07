import type { APIRoute } from 'astro';
import license from '../../LICENSE.md?raw';

export const GET: APIRoute = () =>
  new Response(license, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
