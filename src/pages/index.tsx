import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 1.5rem'}}>
          Never lose AI session context again. Neural Commander watches your development sessions,
          captures learnings, and helps you resume exactly where you left off.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/quick-start">
            Get Started in 5 Minutes
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{marginLeft: '1rem', color: 'white', borderColor: 'white'}}
            to="/docs/architecture/overview">
            How It Works
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickLinks(): ReactNode {
  return (
    <section style={{padding: '2rem 0', background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className="card" style={{height: '100%'}}>
              <div className="card__header">
                <h3>For Claude Code Users</h3>
              </div>
              <div className="card__body">
                <p>Integrate NC with Claude Code for automatic session capture and instant resume.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/developer/claude-code-integration">
                  Claude Code Integration
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card" style={{height: '100%'}}>
              <div className="card__header">
                <h3>CLI Reference</h3>
              </div>
              <div className="card__body">
                <p>Full command reference for the <code>nc</code> CLI tool.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/getting-started/cli-reference">
                  View Commands
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card" style={{height: '100%'}}>
              <div className="card__header">
                <h3>API Reference</h3>
              </div>
              <div className="card__body">
                <p>REST API for integrating NC into your tools and workflows.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/features/api-server">
                  API Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Documentation"
      description="Neural Commander - AI Project Intelligence Platform. Never lose AI session context again.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
      </main>
    </Layout>
  );
}
