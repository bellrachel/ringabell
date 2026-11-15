import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ringabell.co.il',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thanks/') }),
  ],
});
