import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://design.freecodecamp.org',
  integrations: [react(), sitemap()],
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false
    }
  }
});
