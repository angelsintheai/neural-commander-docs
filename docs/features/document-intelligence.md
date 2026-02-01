---
sidebar_position: 3
title: Document Intelligence
description: Documentation management, indexing, health tracking, and search
---

# Document Intelligence

Document Intelligence (DI) is Neural Commander's documentation management system. It organizes project docs into a standardized 00-09 directory structure, indexes documents with cross-references, tracks documentation health, and provides search. DI operates as Track B in NC's dual-track architecture, complementing the [Requirements Manager](/docs/features/requirements-manager) (Track A).

## How It Works

```
Track A (Requirements Manager)         Track B (Document Intelligence)
┌──────────────────────────┐         ┌──────────────────────────┐
│ Requirement lifecycle:   │  Event  │ Documentation lifecycle: │
│ Create, Update, Delete   │──Bus──▶│ Scan, Index, Health      │
│ Validate, Import/Export  │         │ Search, Enrich           │
│                          │         │                          │
│ Owns YAML files          │         │ Reads YAML (read-only)   │
└──────────────────────────┘         └──────────────────────────┘
              │                                │
              └──────────┬─────────────────────┘
                         │
                IntegratedSystem
                (Unified Session Context)
```

Track A owns requirement data. Track B reads it (never writes). They communicate through the event bus.

## Quick Start

### 1. Scan Documentation

```bash
nc docs scan
```

```
Scanning documentation...
  Found: 42 documents
  Categories: 8 active
  Orphaned: 3 files
  Cache updated (valid for 24h)
```

### 2. Check Health

```bash
nc docs health
```

```
Documentation Health Report
═══════════════════════════

Overall Score: 78/100

  Coverage:   85%  (36/42 with metadata)
  Freshness:  72%  (8 stale, 2 abandoned)
  Quality:    90%  (1 empty, 2 tiny)
  Links:      95%  (2 broken / 40 total)

Recommendations:
  1. Update 8 stale documents (90+ days old)
  2. Fix 2 broken cross-references
  3. Populate 1 empty file or remove it
```

### 3. Search

```bash
nc docs search "resource governor"
```

```
Search Results (3 matches)

  1. RESOURCE-GOVERNOR-TECHNICAL-ARCHITECTURE.md
     Category: 03-features | Score: 0.95

  2. RESOURCE-GOVERNOR-USER-GUIDE.md
     Category: 03-features | Score: 0.88

  3. resource-governor-architecture.md
     Category: 02-architecture | Score: 0.72
```

## CLI Commands

### `nc docs scan`

Scan and index project documentation. Results are cached for 24 hours.

```bash
nc docs scan                  # Default scan (uses cache)
nc docs scan --force          # Bypass cache, full rescan
nc docs scan --project NAME   # Scan specific project
```

### `nc docs search <query>`

Full-text search across documentation with relevance scoring.

```bash
nc docs search "authentication"
nc docs search "API" --limit 5 --offset 0
```

| Flag | Default | Description |
|------|---------|-------------|
| `--limit` | 10 | Maximum results |
| `--offset` | 0 | Skip first N results |

### `nc docs info`

Show documentation information for a project.

```bash
nc docs info neural-commander
```

### `nc docs health`

Generate a documentation health report with scoring breakdown.

```bash
nc docs health
nc docs health --project dexinator
```

### `nc docs validate`

Validate documentation metadata (frontmatter, links, naming).

```bash
nc docs validate
```

### `nc docs cache`

Manage the documentation index cache.

```bash
nc docs cache info      # Show cache statistics
nc docs cache clear     # Clear all cached data
```

## 00-09 Directory Structure

DI uses a standardized 10-category structure:

| # | Category | Purpose | Examples |
|---|----------|---------|----------|
| 00 | overview | Big picture, getting started | README, document index, quick start |
| 01 | development | How to build and contribute | Setup guide, build guide, troubleshooting |
| 02 | architecture | How the system is designed | System overview, ADRs, data models |
| 03 | features | What features do and how | Feature specs, user guides, tutorials |
| 04 | operations | How to deploy and run | Deployment, monitoring, maintenance |
| 05 | api | How to integrate | API reference, integration guides |
| 06 | planning | Where we're going | Roadmaps, requirements, phases |
| 07 | learnings | What we've learned | Patterns, gotchas, best practices |
| 08 | status | Where we are now | Sprint reports, progress tracking |
| 09 | archive | What's no longer current | Deprecated docs, old designs |

## Health Scoring

The health score (0-100) is a composite of 5 metrics, each worth 20 points:

| Metric | Full Score | Deduction Trigger |
|--------|-----------|-------------------|
| **Coverage** | 20 pts | < 80% of files have metadata |
| **Freshness** | 20 pts | > 20% of files stale (90+ days) |
| **Sprawl** | 20 pts | Projects with 50-100+ docs |
| **Quality** | 20 pts | Empty files, tiny files, missing titles |
| **Links** | 20 pts | > 5% of cross-references broken |

### Staleness Thresholds

| Age | Classification |
|-----|---------------|
| 0-90 days | Fresh |
| 90-180 days | Stale (needs review) |
| 180+ days | Abandoned (needs action) |

## Session Context Enrichment

DI enriches the session context that Claude Code receives. When you generate context:

```bash
nc req context --output .claude/context.md
```

DI adds documentation-related sections:

- **Related documentation** for active requirements
- **Documentation coverage** (which requirements have linked docs)
- **Health summary** (overall score, stale count)

This helps Claude Code understand your project's documentation landscape.

## Track A/B Integration

### Event-Driven Updates

When requirements change in Track A, DI automatically:

| Event | DI Action |
|-------|-----------|
| Requirement created | Update cross-references, regenerate index |
| Requirement updated | Invalidate cache entry, update links |
| Requirement deleted | Remove cross-references, regenerate index |
| Bulk import | Full cache clear + reindex |

### Read-Only Requirement Access

DI reads requirement YAML files to build documentation-to-requirement mappings. It uses an in-memory cache with `sync.RWMutex` for thread-safe concurrent access.

```yaml
# Example: DI reads this requirement to find linked docs
id: REQ-NC-001
title: Resource Governor Safety
documentation:
  - docs/02-architecture/resource-governor-architecture.md
  - docs/03-features/resource-governor/RESOURCE-GOVERNOR-USER-GUIDE.md
```

## Best Practices

### 1. Add Frontmatter to Documents

```markdown
---
status: active
category: feature
last_updated: 2026-01-31
tags: [api, reference]
---

# API Reference
...
```

### 2. Follow the 00-09 Structure

Place documents in the correct category folder. DI auto-discovers files based on path.

### 3. Regular Health Checks

```bash
# Weekly
nc docs health

# After reorganization
nc docs scan --force
nc docs health
```

### 4. Fix Broken Links Promptly

Broken cross-references degrade health score and reduce documentation value.

## Troubleshooting

### "No documents found"

1. Verify your project has a `docs/` directory
2. Force rescan: `nc docs scan --force`
3. Check project filter: `nc docs scan --project <name>`

### Health Score Dropped

1. Run `nc docs health` for specific recommendations
2. Common causes: new empty files, deleted link targets, time passing (staleness)

### Search Returns No Results

1. Try broader terms
2. Verify scan completed: `nc docs scan`
3. Clear cache: `nc docs cache clear && nc docs scan --force`

---

*Document Intelligence integrates with the [Requirements Manager](/docs/features/requirements-manager) for requirement-to-doc mapping and [Active Alerts](/docs/features/active-alerts) for stale documentation notifications.*
