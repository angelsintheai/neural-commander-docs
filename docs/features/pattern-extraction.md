---
sidebar_position: 4
title: Pattern Extraction
description: Automatic knowledge capture from Claude Code sessions and shell commands
---

# Pattern Extraction

Pattern Extraction automatically captures valuable development patterns from your Claude Code sessions and shell interactions. As you solve problems, NC learns and makes those patterns available for reuse across projects. This is a **Pro tier** feature for cross-project sharing.

## How It Works

```
Your Development Activity
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Commands  │  │ Code     │  │ Claude Code Sessions │  │
│  │ Executed  │  │ Written  │  │ (JSONL parsed)       │  │
│  └─────┬────┘  └────┬─────┘  └──────────┬───────────┘  │
│        └─────────────┼───────────────────┘              │
│                      │                                   │
│              ┌───────┴───────┐                           │
│              │ Pattern Sync  │                           │
│              │ Manager       │                           │
│              │ (SHA256 dedup)│                           │
│              └───────┬───────┘                           │
│                      │                                   │
│           ┌──────────┴──────────┐                       │
│           │  Two-Tier Storage   │                       │
│           │  Global + Per-Project│                       │
│           └─────────────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

## Pattern Categories

NC classifies patterns into 7 categories:

| Category | Description | Example |
|----------|-------------|---------|
| `code_pattern` | Reusable code structures | Graceful HTTP shutdown |
| `architecture` | System design patterns | Event-driven integration |
| `best_practice` | Proven approaches | SQLite WAL mode for concurrency |
| `gotcha` | Common pitfalls | WSL2 process detection quirks |
| `solution` | Problem-specific fixes | Goroutine leak fix |
| `workflow` | Process patterns | Pre-commit validation hook |
| `configuration` | Config patterns | Docker health check settings |

## Quick Start

### List Your Patterns

```bash
nc patterns list
```

```
Patterns (showing top 20)
═════════════════════════

  Go Graceful HTTP Shutdown                    code_pattern
  Language: go | Used: 4 times | Success: 100%
  Tags: go, http, graceful-shutdown
  ──────────────────────────────────────

  Fix WSL2 Process Detection                   solution
  Language: go | Used: 2 times | Success: 100%
  Tags: wsl2, process, cross-platform
```

### Search Patterns

```bash
nc patterns search "error handling"
```

### Apply a Pattern

Mark a pattern as used (tracks effectiveness):

```bash
nc patterns apply a1b2c3d4
```

### View Statistics

```bash
nc patterns stats
```

```
Pattern Statistics
══════════════════

Total Patterns: 42

By Category:
  code_pattern:    15 (35.7%)
  solution:        10 (23.8%)
  best_practice:    8 (19.0%)

By Language:
  go:              22 (52.4%)
  python:           8 (19.0%)
  typescript:        6 (14.3%)

Average Success Rate: 94.2%
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `nc patterns list` | Display patterns (top 20 by default) |
| `nc patterns list --global` | Show all patterns |
| `nc patterns list --category <cat>` | Filter by category |
| `nc patterns list --language <lang>` | Filter by language |
| `nc patterns search <query>` | Full-text search |
| `nc patterns apply <id>` | Mark pattern as used |
| `nc patterns sync` | Export to global store (Pro tier) |
| `nc patterns stats` | View aggregated statistics |
| `nc patterns remove <id>` | Delete a pattern |

Pattern IDs support partial matching (first 4+ characters).

## Automatic Capture

When the NC daemon is running, patterns are captured automatically from:

1. **Claude Code sessions** - The Harvester parses JSONL session files, extracting prompts and outcomes (file changes, git commits, tool results)
2. **Shell commands** - Command execution patterns with success/failure tracking
3. **Code changes** - Significant code patterns during file monitoring

### Value Estimation

Each pattern receives an estimated time-savings value:

| Pattern Type | Estimated Minutes Saved |
|-------------|------------------------|
| Fix | 30 min |
| Optimization | 20 min |
| Refactor / Architecture | 15 min |
| Function | 10 min |
| Command | 5 min (10 for pipelines) |

Patterns saving 30+ minutes trigger high-value notifications through [Active Alerts](/docs/features/active-alerts).

## Cross-Project Sharing (Pro)

NC scores patterns against your current project context using multiple factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Language match | 0.40 | Primary language match |
| Framework match | 0.30 | Framework match |
| Tag overlap | 0.20 | Shared tags |
| Success rate | 0.10 | Historical reliability |
| Recency | 0.10 | Recently used patterns |

Only patterns scoring above 0.30 are recommended. Top 10 per project.

```bash
# Sync project patterns to global store
nc patterns sync

# Other projects automatically get relevant recommendations
```

## Storage

Patterns use a two-tier storage layout:

```
~/.neural-commander/
└── patterns/
    ├── global/
    │   └── patterns.json    # Cross-project patterns
    └── projects/
        ├── project-a/
        │   └── learnings/   # Project-specific
        └── project-b/
            └── learnings/
```

Deduplication uses SHA256 hashing of content. Duplicate patterns increment usage count instead of creating copies.

## API Access

Patterns are available via the NC REST API on port 7669:

```bash
# List all patterns
curl http://localhost:7669/api/patterns

# Filter by category
curl "http://localhost:7669/api/patterns?category=code_pattern"

# Search by keyword
curl "http://localhost:7669/api/patterns?q=error+handling"

# Add a pattern
curl -X POST http://localhost:7669/api/patterns \
  -H "Content-Type: application/json" \
  -d '{"title":"My Pattern","content":"code here","category":"code_pattern"}'

# Track usage
curl -X POST http://localhost:7669/api/patterns/a1b2c3d4/apply

# Get statistics
curl http://localhost:7669/api/patterns/stats

# Get relevant patterns for a project
curl -X POST http://localhost:7669/api/patterns/relevant \
  -d '{"language":"go","tags":["api","daemon"]}'
```

## Troubleshooting

### No Patterns Showing

1. Ensure the daemon is running: `nc daemon status`
2. Check with `--global` flag: `nc patterns list --global`
3. Work in a Claude Code session with the daemon running to start capturing

### Sync Fails with Tier Error

Cross-project sync requires Pro tier. Use `nc patterns list` for local patterns on Free tier.

### Pattern Not Being Captured

1. Verify harvester access: `ls ~/.claude/projects/`
2. Check harvest window (default: last 7 days)
3. Prompts shorter than 10 or longer than 50,000 characters are skipped

---

*Pattern Extraction integrates with [Session Intelligence](/docs/features/session-intelligence) for session data and [Active Alerts](/docs/features/active-alerts) for high-value pattern notifications.*
