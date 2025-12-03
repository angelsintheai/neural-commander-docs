import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Neural Commander',
  tagline: 'AI Project Intelligence Platform',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.neuralcommander.ai',
  baseUrl: '/',

  organizationName: 'angelsintheai',
  projectName: 'neural-commander',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/angelsintheai/neural-commander-docs/tree/main/',
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/nc-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Neural Commander',
      logo: {
        alt: 'Neural Commander Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://neuralcommander.ai',
          label: 'Home',
          position: 'right',
        },
        {
          href: 'https://github.com/angelsintheai/neural-commander',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/quick-start',
            },
            {
              label: 'Features',
              to: '/docs/features/session-intelligence',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/angelsintheai/neural-commander',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/neuralcommander',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://neuralcommander.ai',
            },
            {
              label: 'Pro Tier',
              href: 'https://neuralcommander.ai/pricing',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Artilect Ventures Pty Ltd. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'go', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
