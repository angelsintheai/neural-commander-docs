---
sidebar_position: 8
title: Prompt Engine
description: Automatic prompt harvesting, quality scoring, and searchable prompt library
---

# Prompt Engine

The Prompt Engine (Universal Prompt Harvester) automatically collects prompts from your Claude Code sessions, scores them for quality using a hybrid algorithmic + human feedback system, and builds a searchable prompt library. Over time, your best prompts surface through combined algorithmic scoring and your own ratings.

## How It Works

```
Claude Code Sessions (~/.claude/projects/)
    │
    ├── project-a/sessions/*.jsonl
    ├── project-b/sessions/*.jsonl
    └── ...
    │
    ▼
┌──────────────────────────────────────────┐
│            Prompt Engine                  │
│                                          │
│  ┌────────┐  ┌────────┐  ┌───────────┐  │
│  │Harvester│  │Scorer  │  │Feedback   │  │
│  │(JSONL)  │  │(hybrid)│  │Manager    │  │
│  └───┬─────┘  └───┬────┘  └────┬──────┘  │
│      │             │            │         │
│  ┌───┴─────────────┴────────────┴──────┐  │
│  │  Store (SQLite + FTS4)              │  │
│  │  ~/.neural-commander/prompts.db     │  │
│  └─────────────────────────────────────┘  │
│      │                                    │
│  ┌───┴──────────┐                        │
│  │  Embeddings  │ (Pro tier, Ollama)     │
│  │  Manager     │                        │
│  └──────────────┘                        │
└──────────────────────────────────────────┘
    │                    │
┌───┴───┐           ┌───┴────┐
│  CLI  │           │REST API│
│(nc    │           │(:7669) │
│prompts)│          └────────┘
└────────┘
```

The harvester reads JSONL session files, extracts user prompts, links them to outcomes (file changes, commits, tool results), scores each prompt, and stores everything in a local SQLite database with full-text search.

## Quick Start

### 1. Harvest Prompts

```bash
nc prompts harvest
```

```
Harvesting prompts from Claude Code sessions...
  Scanned: 47 session files
  New prompts: 23
  Duplicates skipped: 156
  Outcomes linked: 41

Harvest complete in 3.2s
```

### 2. Browse Your Library

```bash
nc prompts list
```

```
Prompt Library (showing 20 of 179)

  a1b2c3d4  "Implement graceful shutdown with context..."
            Project: neural-commander | Category: code
            Score: 0.82 | Tokens: 156 | 2026-01-30

  e5f6g7h8  "Fix the goroutine leak in the daemon..."
            Project: neural-commander | Category: debug
            Score: 0.76 | Tokens: 89 | 2026-01-29
  ...
```

### 3. Search

```bash
nc prompts search "error handling"
```

### 4. Rate a Prompt

```bash
nc prompts rate a1b2c3d4 --score 5
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `nc prompts harvest` | Collect prompts from Claude Code sessions |
| `nc prompts list` | List harvested prompts (filterable) |
| `nc prompts search <query>` | Keyword search (FTS4 with Porter stemming) |
| `nc prompts search <query> --semantic` | Semantic search via embeddings (Pro) |
| `nc prompts show <id>` | View full prompt details and outcomes |
| `nc prompts rate <id> --score N` | Rate a prompt 1-5 stars |
| `nc prompts stats` | Library statistics by category and project |
| `nc prompts top` | Highest-scored prompts |
| `nc prompts embed` | Generate embeddings for semantic search (Pro) |
| `nc prompts copy <id>` | Copy prompt to clipboard |
| `nc prompts browse` | Interactive prompt browser |

Prompt IDs support partial matching (first 4+ characters).

## Quality Scoring

Each prompt receives a composite score from 0.0 to 1.0, combining algorithmic analysis with your ratings.

### Algorithmic Components

| Component | Weight | What It Measures |
|-----------|--------|-----------------|
| Success Rate | 30% | Did tool calls succeed after this prompt? |
| Reuse Potential | 20% | Applicable across projects? |
| Clarity | 15% | Well-structured, clear language? |
| Specificity | 15% | Mentions files, functions, errors concretely? |
| Outcome Quality | 20% | Produced file changes or commits? |

**Formula**: `AlgoScore = 0.30*Success + 0.20*Reuse + 0.15*Clarity + 0.15*Specificity + 0.20*Outcome`

### Human Feedback Multiplier

Your ratings adjust the composite score:

| Stars | Multiplier |
|-------|------------|
| 1 | 0.50x |
| 2 | 0.75x |
| 3 | 1.00x (neutral) |
| 4 | 1.50x |
| 5 | 2.00x |

**Composite**: `MIN(1.0, AlgoScore * HumanMultiplier)`

Ratings are time-weighted: recent feedback counts more (2.0x within 24h, 1.5x within 7 days, 1.0x older).

## Prompt Categories

Prompts are auto-categorized during harvest:

| Category | Detection Keywords |
|----------|-------------------|
| `code` | create, implement, write, function, class |
| `debug` | fix, error, bug, debug, crash |
| `design` | design, architect, structure, pattern |
| `docs` | document, readme, comment, explain |
| `refactor` | refactor, clean, improve, simplify |
| `test` | test, spec, assert, coverage |
| `config` | config, setup, install, deploy |
| `other` | Default fallback |

## Prompt Outcomes

The harvester tracks what happened after each prompt within a 5-minute window:

| Outcome | Impact |
|---------|--------|
| `file_change` | Positive (code was generated) |
| `git_commit` | Positive (work was committed) |
| `tool_success` | Positive (tool worked) |
| `tool_failure` | Negative (tool errored) |
| `follow_up` | Neutral (session continued) |
| `session_end` | Neutral (session completed) |

## Semantic Search (Pro)

With Ollama running locally, generate embeddings for AI-powered semantic search:

```bash
# Install model
ollama pull nomic-embed-text

# Generate embeddings
nc prompts embed

# Search by meaning, not just keywords
nc prompts search "how to safely stop a background process" --semantic
```

Semantic search uses 384-dimensional vectors and cosine similarity to find conceptually related prompts even without matching keywords.

## API Access

The Prompt Engine REST API runs on port 7669:

```bash
# List prompts
curl "http://localhost:7669/api/prompts?limit=20"

# Search
curl "http://localhost:7669/api/prompts/search?q=error+handling"

# Get prompt details
curl "http://localhost:7669/api/prompts/a1b2c3d4"

# Rate a prompt
curl -X POST "http://localhost:7669/api/prompts/a1b2c3d4/rate" \
  -H "Content-Type: application/json" \
  -d '{"score": 5, "source": "api"}'

# Trigger harvest
curl -X POST "http://localhost:7669/api/prompts/harvest"

# Statistics
curl "http://localhost:7669/api/prompts/stats"

# Top prompts
curl "http://localhost:7669/api/prompts/top?limit=10"
```

## Background Daemon

With the daemon running (`nc daemon start`), harvesting runs automatically every 5 minutes and scoring every 15 minutes. No manual harvesting needed.

## Tier Features

| Feature | Community | Pro |
|---------|-----------|-----|
| Harvest prompts | Yes | Yes |
| Keyword search (FTS4) | Yes | Yes |
| List, show, rate, browse | Yes | Yes |
| Statistics and top prompts | Yes | Yes |
| **Semantic search** | No | Yes |
| **Generate embeddings** | No | Yes |
| **Cross-project patterns** | No | Yes |

## Troubleshooting

### "No prompts found"

1. Verify sessions exist: `ls ~/.claude/projects/`
2. Run harvest: `nc prompts harvest`
3. Prompts shorter than 10 or longer than 50,000 chars are filtered

### Low Scores on Good Prompts

1. Check outcomes: `nc prompts show <id>`
2. The 5-minute correlation window may miss delayed results
3. Rate manually: `nc prompts rate <id> --score 5`

### Semantic Search Not Working

1. Verify Ollama: `curl http://localhost:11434/api/tags`
2. Pull model: `ollama pull nomic-embed-text`
3. Generate embeddings: `nc prompts embed`

---

*The Prompt Engine integrates with [Pattern Extraction](/docs/features/pattern-extraction) for pattern discovery from outcomes and [Session Intelligence](/docs/features/session-intelligence) for session data.*
