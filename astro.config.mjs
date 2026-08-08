import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://apneasport.ee',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  i18n: {
    locales: ['et', 'en'],
    defaultLocale: 'et',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'et',
        locales: {
          et: 'et-EE',
          en: 'en',
        },
      },
    }),
  ],
});
