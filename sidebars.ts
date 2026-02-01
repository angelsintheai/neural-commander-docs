import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/first-scan',
        'getting-started/cli-reference',
        'getting-started/troubleshooting',
        'getting-started/faq',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/session-intelligence',
        'features/requirements-manager',
        'features/document-intelligence',
        'features/pattern-extraction',
        'features/admin-console',
        'features/resource-governor',
        'features/api-server',
        'features/prompt-engine',
        'features/global-learnings',
        'features/active-alerts',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/data-models',
        'architecture/session-persistence',
        'architecture/learning-system',
        'architecture/plugin-system',
        {
          type: 'category',
          label: 'ADRs',
          items: [
            'architecture/decisions/adr-index',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'developer/contributing',
        'developer/setup',
        'developer/building',
        'developer/testing',
        'developer/ide-integration',
        'developer/obsidian-integration',
        'developer/claude-code-integration',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'operations/deployment',
        'operations/security',
        'operations/monitoring',
      ],
    },
  ],
};

export default sidebars;
