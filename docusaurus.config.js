import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Creche da Tia Tata',
  tagline: 'Centralizando a gestão e conectando doadores.',
  favicon: 'img/favicon.png',

  // Configurações para o GitHub Pages
  url: 'https://mdsreq-fga-unb.github.io', // URL base da organização no GitHub
  baseUrl: '/REQ-2026.1-T02-CrecheTiaTata/', // Nome exato do repositório
  organizationName: 'mdsreq-fga-unb', 
  projectName: 'REQ-2026.1-T02-CrecheTiaTata', 
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Idioma do site
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Link para o botão "Editar esta página"
          editUrl: 'https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/tree/main/',
        },
        blog: false, // Desliguei o blog porque é um projeto de Requisitos, deixa mais limpo!
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Creche da Tia Tata',
        logo: {
          alt: 'Logo do Projeto',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentação', // Mudei de "Tutorial" para "Documentação"
          },
          {
            href: 'https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Navegação',
            items: [
              {
                label: 'Documentação Inicial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Repositório',
            items: [
              {
                label: 'GitHub do Projeto',
                href: 'https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Grupo 02 - Requisitos UnB. Feito com Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;