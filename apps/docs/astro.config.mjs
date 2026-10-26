import { uiText } from './src/i18n/messages.ts';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import docsBaseLinks from './remark-docs-base.mjs';
import focusCodeBlocks from './focus-code-blocks.mjs';
const base = process.env.SDR_DOCS_BASE ?? '/';
export default defineConfig({
  base, site: process.env.SDR_DOCS_SITE,
  markdown: { remarkPlugins: [[docsBaseLinks, { base }]] },
  integrations: [react(), starlight({
    title: 'SDR', description: 'Romanian Design System / Sistem de Design Românesc — independent proposal',
    defaultLocale: 'ro', locales: { ro: { label: 'Română', lang: 'ro' }, en: { label: 'English', lang: 'en' } },
    customCss: ['./src/styles/docs.css'],
    routeMiddleware: './src/sidebar-middleware.ts',
    expressiveCode: { plugins: [focusCodeBlocks()] },
    components: { SkipLink: './src/components/SkipLink.astro', SiteTitle: './src/components/SiteTitle.astro', Hero: './src/components/Hero.astro', SocialIcons: './src/components/TopNav.astro', Footer: './src/components/Footer.astro', Sidebar: './src/components/Sidebar.astro' },
    sidebar: [
      { label: uiText('ro', "navigation.Starthere"), translations: { en: uiText('en', "navigation.Starthere") }, items: [
        { slug: 'getting-started' }, { slug: 'architecture' }, { slug: 'coverage' },
      ] },
      { label: uiText('ro', "Identity.foundations"), translations: { en: uiText('en', "Identity.foundations") }, items: [{ autogenerate: { directory: 'foundations' } }] },
      { label: uiText('ro', "Identity.components"), translations: { en: uiText('en', "Identity.components") }, items: [{ autogenerate: { directory: 'components' } }], collapsed: true },
      { label: uiText('ro', "Identity.servicePatterns"), translations: { en: uiText('en', "Identity.servicePatterns") }, items: [{ autogenerate: { directory: 'patterns' } }], collapsed: true },
      { label: uiText('ro', 'navigation.experimentalStudies'), translations: { en: uiText('en', 'navigation.experimentalStudies') }, items: [{ autogenerate: { directory: 'studies' } }], collapsed: true },
      { label: uiText('ro', "Identity.accessibility"), translations: { en: uiText('en', "Identity.accessibility") }, slug: 'accessibility' },
      { label: uiText('ro', "Identity.contributing"), translations: { en: uiText('en', "Identity.contributing") }, slug: 'contributing' },
      { label: uiText('ro', "navigation.Sourcesandlicences"), translations: { en: uiText('en', "navigation.Sourcesandlicences") }, slug: 'sources' },
    ],
  })],
  redirects: {
    '/': base + 'ro/',
  },
  vite: { define: { 'process.env.SDR_DOCS_BASE': JSON.stringify(base) }, server: { fs: { allow: ['../..'] } } },
});
