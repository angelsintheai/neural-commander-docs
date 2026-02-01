---
sidebar_position: 9
title: Global Learnings
description: Cross-project knowledge management with automatic crawling, indexing, and semantic search
---

# Global Learnings

Global Learnings is NC's knowledge management system. It automatically crawls your project documentation (CLAUDE.md, learnings, architecture docs), indexes it into a searchable database, and provides both keyword and AI-powered semantic search across all your projects.

## How It Works

```
Development Projects
    │
    ├── project-a/
    │   ├── CLAUDE.md
    │   ├── LEARNINGS/*.md
    │   └── docs/00-09/*.md
    ├── project-b/
    │   └── ...
    │
    ▼
┌──────────────────────────────────────────┐
│          Global Learnings System          │
│                                          │
│  ┌──────────┐  ┌────────┐  ┌─────────┐  │
│  │ Crawler   │  │ Parser │  │ Store   │  │
│  │ (project  │  │ (MD    │  │ (SQLite │  │
│  │  discovery)│  │ sections)│ │ wisdom.db)││
│  └─────┬────┘  └────┬───┘  └────┬────┘  │
│        └─────────────┘           │       │
│                                  │       │
│  ┌──────────┐             ┌─────┴─────┐  │
│  │ Embedder │             │ Pattern   │  │
│  │ (Ollama) │             │ Sync Mgr  │  │
│  └──────────┘             └───────────┘  │
└──────────────────────────────────────────┘
```

The system has two subsystems:
- **Wisdom System** - Crawls, indexes, and searches project documentation
- **Learning Manager** - Captures insights from Claude Code sessions and syncs patterns across projects

## Quick Start

### 1. Index Your Projects

```bash
nc wisdom crawl
```

```
Crawling projects...
  Discovered: 5 projects
  Crawling: neural-commander (42 docs)
  Crawling: dexinator (18 docs)
  Crawling: counterpartytools (25 docs)

Crawl complete in 3.1s
  Projects: 5 | Documents indexed: 105
```

### 2. Search Your Knowledge

```bash
nc wisdom search "error handling"
```

```
Search Results (6 matches)

  1. [architecture] Error Handling Strategy
     Project: neural-commander | Source: docs
     "Use structured errors with error codes..."

  2. [learning] WSL2 Error Handling Gotcha
     Project: neural-commander | Source: LEARNINGS
     "Discovered that WSL2 process detection..."
```

### 3. Generate Embeddings (Pro)

```bash
ollama pull nomic-embed-text
nc wisdom embed
nc wisdom semantic "how to handle errors gracefully"
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `nc wisdom crawl` | Index all project documentation |
| `nc wisdom crawl --project NAME` | Index specific project |
| `nc wisdom crawl --force` | Re-index everything |
| `nc wisdom search <query>` | Keyword search across all wisdom |
| `nc wisdom semantic <query>` | AI-powered semantic search (Pro) |
| `nc wisdom show <project>` | Project wisdom summary |
| `nc wisdom stats` | Wisdom engine statistics |
| `nc wisdom context` | Relevant wisdom for current project |
| `nc wisdom reindex <project>` | Force re-index specific project |
| `nc wisdom embed` | Generate embeddings (Pro) |

## What Gets Crawled

Documents are crawled in priority order:

| Priority | Path | Description |
|----------|------|-------------|
| 1 | `CLAUDE.md` | Project instructions for AI |
| 2 | `.claude/*.md` | AI context files |
| 3 | `LEARNINGS/**/*.md` | Captured lessons |
| 4 | `docs/00-overview/*.md` | Overview documentation |
| 5 | `docs/02-architecture/*.md` | Architecture docs |
| 6 | `docs/06-planning/*.md` | Planning docs |
| 7 | `README.md`, `ARCHITECTURE.md` | Standard files |

**Excluded**: `node_modules/`, `.git/`, `vendor/`, `dist/`, `build/`

Projects are discovered by looking for `.git`, `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, or `CLAUDE.md`.

## Wisdom Categories

Documents are automatically categorized during crawl:

| Category | Description | Example |
|----------|-------------|---------|
| `architecture` | System design, components | "Bubbletea TUI framework" |
| `learning` | Lessons, gotchas, tips | "WSL2 process detection quirks" |
| `requirement` | Must/shall constraints | "Resource safety requirements" |
| `workflow` | Processes, how-to guides | "Release deployment process" |
| `integration` | API, service integration | "Ollama embedding integration" |
| `decision` | ADRs, rationale | "Chose SQLite over PostgreSQL" |
| `instruction` | Rules, conventions | "Git commit format rules" |
| `status` | Progress updates | "Sprint 6 progress report" |

Categories are inferred from document titles and content automatically.

## Semantic Search (Pro)

Generate embeddings for AI-powered search that finds conceptually related content:

```bash
# Setup
ollama pull nomic-embed-text
nc wisdom embed

# Search by meaning
nc wisdom semantic "how to safely stop background processes"
# Finds documents about "graceful shutdown" even without that keyword
```

The embedder uses `nomic-embed-text` (768 dimensions) via local Ollama. Falls back to keyword search if Ollama is unavailable.

## Pattern Sharing

The Pattern Sync Manager enables cross-project pattern reuse:

```bash
# Patterns from one project become available to others
nc patterns sync

# Patterns are scored for relevance to your current project
# Based on: language match (40%), framework (30%), tags (20%), usage (10%)
```

Patterns are deduplicated by SHA256 content hash. Duplicate patterns increment usage count instead of creating copies.

## Automatic Learning Capture

When the daemon is running, the Learning Manager automatically captures insights from Claude Code sessions:

- Messages with `role="learning"` are captured directly
- Assistant messages containing keywords ("pattern", "best practice", "gotcha", "solution") are detected and stored
- Tags are auto-extracted from content

Captured learnings are stored as JSON files in `~/.neural-commander/learnings/`.

## Storage

```
~/.neural-commander/
├── wisdom.db              # SQLite: crawled docs + embeddings
├── learnings/             # JSON files: session learnings
│   ├── session-abc-001.json
│   └── session-def-002.json
└── patterns/
    └── global/
        └── patterns.json  # Cross-project patterns
```

## Tier Features

| Feature | Community | Pro |
|---------|-----------|-----|
| Wisdom crawl | Yes | Yes |
| Keyword search | Yes | Yes |
| Project show/stats | Yes | Yes |
| Reindex | Yes | Yes |
| Capture learnings | Yes | Yes |
| Check patterns | Yes | Yes |
| **Semantic search** | No | Yes |
| **Generate embeddings** | No | Yes |
| **Context-aware wisdom** | No | Yes |
| **Cross-project sharing** | No | Yes |
| **Learning search/stats** | No | Yes |

## Troubleshooting

### "No projects found"

1. Verify the projects root contains projects with marker files (.git, package.json, etc.)
2. Force crawl: `nc wisdom crawl --force`

### Semantic Search Returns No Results

1. Check embedding coverage: `nc wisdom stats`
2. Ensure Ollama is running: `curl http://localhost:11434/api/tags`
3. Generate embeddings: `nc wisdom embed`

### Search Quality is Poor

1. Re-crawl after documentation changes: `nc wisdom crawl`
2. Re-embed: `nc wisdom embed`
3. Use semantic search for conceptual queries, keyword search for exact terms

---

*Global Learnings integrates with [Pattern Extraction](/docs/features/pattern-extraction) for pattern promotion, [Prompt Engine](/docs/features/prompt-engine) for prompt context, and [Session Intelligence](/docs/features/session-intelligence) for session data.*
