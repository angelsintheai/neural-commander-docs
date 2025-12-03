import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Session Intelligence',
    icon: '🧠',
    description: (
      <>
        Automatically captures your AI development sessions. Resume exactly where you left off,
        with full context of what you were working on.
      </>
    ),
  },
  {
    title: 'Learning Capture',
    icon: '📚',
    description: (
      <>
        Every hard-won insight is automatically captured and indexed. Build a knowledge base
        that grows with your experience.
      </>
    ),
  },
  {
    title: 'Document Intelligence',
    icon: '📋',
    description: (
      <>
        Automatically scan and index project documentation. Find answers instantly,
        maintain docs hygiene across all your projects.
      </>
    ),
  },
  {
    title: 'Multi-Project Awareness',
    icon: '🌐',
    description: (
      <>
        Manage multiple projects simultaneously. Share learnings across projects and
        never repeat the same mistake twice.
      </>
    ),
  },
  {
    title: 'Claude Code Integration',
    icon: '🤖',
    description: (
      <>
        Deep integration with Claude Code for automatic session detection, context injection,
        and seamless workflow.
      </>
    ),
  },
  {
    title: 'Requirements Tracking',
    icon: '✅',
    description: (
      <>
        Track project requirements from planning to completion. Link requirements to code,
        tests, and documentation.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{fontSize: '3rem', marginBottom: '1rem'}}>
        {icon}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center" style={{marginBottom: '2rem'}}>
          <Heading as="h2">Why Neural Commander?</Heading>
          <p style={{fontSize: '1.1rem', color: 'var(--ifm-color-emphasis-700)'}}>
            Built for developers who use AI assistants and need to maintain context across sessions.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
