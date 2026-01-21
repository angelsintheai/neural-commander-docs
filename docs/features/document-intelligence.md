---
sidebar_position: 3
title: Document Intelligence
description: AI-powered documentation analysis and search
---

# Document Intelligence

NC's Document Intelligence system scans, indexes, and searches documentation across your entire project ecosystem. It provides instant access to relevant docs, health monitoring, and metadata validation.

## Core Features

- **Ecosystem-wide scanning** - Index thousands of markdown files across all projects
- **Smart search** - Keyword and metadata-based search with relevance scoring
- **Health monitoring** - Detect stale, missing, or sprawling documentation
- **Metadata validation** - Verify documentation follows standards

## Quick Start

```bash
# Scan all documentation (builds index)
nc docs scan

# Search for documentation
nc docs search "api authentication"

# Check documentation health
nc docs health
```

## Commands

### docs scan

Recursively scan and index all markdown files:

```bash
# Initial scan (cached for 24 hours)
nc docs scan

# Force rescan, ignoring cache
nc docs scan --force
```

**Output:**
```
🔍 Scanning /mnt/c/dev/projects...
📂 Found 2366 markdown files across 46 projects
✅ Index built in 12.3s
💾 Cached at ~/.nc/cache/docs/doc-index.json
```

### docs search

Search documentation by keyword or metadata:

```bash
# Basic search
nc docs search "api"

# Limit results (v0.98.3+)
nc docs search "api" --limit 10

# Pagination (v0.98.3+)
nc docs search "api" --limit 10 --offset 10
```

**Output:**
```
🔍 SEARCH RESULTS FOR: "api"
============================================================

Found 25 results, showing 1-10 (use --limit N --offset N for pagination)

1. API-REFERENCE.md (score: 20.0)
   Project: neural-commander
   Path: neural-commander/docs/API-REFERENCE.md
   Matches: filename (1), metadata (3)

2. api-server.md (score: 17.0)
   Project: my-project
   Path: my-project/docs/api-server.md
   Matches: metadata (2), filename (1)
...
```

**Search flags (v0.98.3+):**

| Flag | Description | Default |
|------|-------------|---------|
| `--limit N` | Maximum results to show | 20 |
| `--offset N` | Skip first N results | 0 |

### docs info

Get detailed information about a project or file:

```bash
# Project info
nc docs info neural-commander

# File info
nc docs info /path/to/file.md
```

### docs health

Generate documentation health report:

```bash
nc docs health
```

**Output:**
```
📊 DOCUMENTATION HEALTH REPORT
==============================

Projects Analyzed: 46
Total Documents: 2366

Coverage:
  ✅ 38 projects have README.md
  ⚠️  8 projects missing documentation

Staleness (>90 days since update):
  ⚠️  124 documents need review

Sprawl Detection:
  ⚠️  15 projects have >50 docs (consider consolidation)
```

### docs validate

Validate documentation metadata against standards:

```bash
nc docs validate
```

Checks for:
- Required frontmatter fields (title, description)
- Valid status values
- Date format compliance
- Category standardization

### docs cache

Manage the documentation index cache:

```bash
# Show cache info
nc docs cache info

# Clear cache
nc docs cache clear
```

## Search Scoring

NC scores search results based on multiple factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Filename match | 10.0 | Query appears in filename |
| Title match | 8.0 | Query appears in title metadata |
| Category match | 5.0 | Query matches category |
| Tag match | 3.0 | Query matches tags |
| Content match | 1.0 | Query appears in file content |

Results are sorted by total score (highest first).

## Index Structure

The documentation index is stored at `~/.nc/cache/docs/doc-index.json`:

```json
{
  "version": "1.0",
  "scanned_at": "2026-01-21T10:15:00Z",
  "projects_count": 46,
  "documents_count": 2366,
  "documents": {
    "/path/to/file.md": {
      "path": "/path/to/file.md",
      "project": "my-project",
      "title": "API Reference",
      "category": "api",
      "status": "active",
      "last_modified": "2026-01-15T08:30:00Z"
    }
  },
  "by_project": {
    "my-project": ["/path/to/file.md", ...]
  }
}
```

## Best Practices

### 1. Add Frontmatter to Documents

```markdown
---
title: API Reference
description: Complete API documentation
category: api
status: active
last_updated: 2026-01-21
tags: [api, reference, rest]
---

# API Reference
...
```

### 2. Organize by Category

```
docs/
├── 00-overview/
├── 01-getting-started/
├── 02-architecture/
├── 03-api/
├── 04-operations/
└── 05-reference/
```

### 3. Regular Health Checks

```bash
# Weekly health check
nc docs health

# Address stale documents
nc docs search --stale-days 90
```

### 4. Use Consistent Naming

- `README.md` for project overview
- `CHANGELOG.md` for version history
- `CONTRIBUTING.md` for contributor guide
- Lowercase with hyphens: `api-reference.md`

## API Reference

### GET /api/docs/search

Search documentation via API:

```bash
curl "http://localhost:7669/api/docs/search?q=api&limit=10"
```

### GET /api/docs/health

Get documentation health report:

```bash
curl "http://localhost:7669/api/docs/health"
```

### GET /api/docs/projects

List all indexed projects:

```bash
curl "http://localhost:7669/api/docs/projects"
```

---

*See [Architecture Overview](/docs/architecture/overview) for how Document Intelligence integrates with other NC systems.*
