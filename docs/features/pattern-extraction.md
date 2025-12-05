---
sidebar_position: 4
title: Pattern Extraction
description: Learn from your codebase patterns
---

# Pattern Extraction

Pattern Extraction automatically captures valuable development patterns from your work - commands you run, code you write, and problems you solve. These patterns become reusable knowledge that saves time on future projects.

## The Value

**Example**: You spend 30 minutes figuring out a complex Git rebase workflow. NC captures this pattern. Next time you or your team faces the same situation, the pattern is instantly available.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Your Development Activity                                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Commands   │  │   Code       │  │  Claude      │      │
│  │   Executed   │  │   Written    │  │  Sessions    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └────────────────┬┘                  │               │
│                          │                   │               │
│                    ┌─────┴──────────────────┴┐              │
│                    │   Pattern Extraction    │              │
│                    │   (Automatic)           │              │
│                    └─────────────────────────┘              │
│                               │                              │
│                    ┌──────────┴──────────┐                  │
│                    │   Pattern Library   │                  │
│                    │   (Searchable)      │                  │
│                    └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Pattern Types

NC recognizes and captures several types of patterns:

| Type | Description | Example |
|------|-------------|---------|
| **Command** | Shell commands and pipelines | `git log --oneline \| grep fix` |
| **Function** | Code implementations | Error handling patterns |
| **Fix** | Bug fix solutions | Null pointer fix patterns |
| **Optimization** | Performance improvements | Query optimization |
| **Refactor** | Code restructuring | Extract method patterns |
| **Architecture** | Design patterns | Singleton, Factory, etc. |

## Using Patterns

### List Your Top Patterns

```bash
# View your most valuable patterns
nc patterns list

# View top 10 by time saved
nc patterns list --top 10
```

**Example Output**:
```
Top Patterns by Value
=====================

#  TITLE                           TYPE         MINUTES SAVED   REUSES
1  Docker multi-stage build        command      45              12
2  Git interactive rebase          command      35              8
3  Error handling middleware       function     30              15
4  Database connection pool        architecture 25              6
5  API rate limiting               function     20              4

Total patterns: 42
Total time saved: 1,260 minutes (~21 hours)
```

### Search Patterns

```bash
# Search by keyword
nc patterns search "git"

# Search by tag
nc patterns search --tag docker

# Search by type
nc patterns search --type fix
```

### View Pattern Details

```bash
nc patterns show <pattern-id>
```

**Example Output**:
```
Pattern: Git Interactive Rebase
===============================

ID:          a1b2c3d4
Type:        command
Created:     2025-12-01
Last Used:   2025-12-05
Reuse Count: 8

Command:
  git rebase -i HEAD~5

Description:
  Interactive rebase to clean up last 5 commits before pushing.
  Useful for squashing, reordering, and editing commit messages.

Tags: git, rebase, cleanup

Value:
  Estimated Minutes Saved: 35
  Complexity Score: 3
  Success Rate: 100%
```

## Automatic Capture

NC automatically captures patterns when:

1. **Commands are executed** via the daemon
2. **Claude Code sessions** generate valuable solutions
3. **High-value code** is written in monitored projects

### What Makes a Pattern "High Value"?

NC estimates time savings based on:

| Factor | Impact |
|--------|--------|
| Pattern type | Fixes = 30 min, Optimizations = 20 min |
| Complexity | +5 min per control structure |
| Pipeline usage | +5 min for command chains |
| Reuse frequency | Multiplied by reuse count |

Patterns saving 30+ minutes are flagged as "high value" and trigger notifications.

## Manual Capture

### Capture a Command Pattern

```bash
# Capture a command you just ran
nc patterns capture --command "git bisect run ./test.sh" \
  --title "Git bisect automation" \
  --description "Find bug-introducing commit automatically"
```

### Capture from Claude Session

```bash
# Capture patterns from a specific session
nc patterns capture --session <session-id>

# Capture from current/latest session
nc patterns capture --session latest
```

## Pattern Sharing

### Export Patterns

```bash
# Export to file
nc patterns export patterns.json

# Export specific patterns
nc patterns export --tag docker docker-patterns.json
```

### Import Patterns

```bash
# Import from file
nc patterns import team-patterns.json

# Import with merge (don't overwrite existing)
nc patterns import team-patterns.json --merge
```

## High-Value Notifications

When a high-value pattern is discovered, you'll see:

```
[NC] High-value pattern discovered!
  Title: Database connection retry logic
  Saves: ~45 minutes
  Type: fix

  View: nc patterns show f7e8d9c0
```

## Configuration

### View Current Settings

```bash
nc config get pattern_extraction
```

### Adjust Settings

```bash
# Set minimum value threshold
nc config set pattern_threshold 30

# Enable/disable auto-capture
nc config set pattern_auto_capture true

# Set share threshold (auto-share after N reuses)
nc config set pattern_share_threshold 5
```

## API Access

Patterns are available via the NC API:

```bash
# List patterns
curl http://localhost:7669/api/patterns

# Get specific pattern
curl http://localhost:7669/api/patterns/<id>

# Search patterns
curl "http://localhost:7669/api/patterns?q=docker&type=command"
```

## Best Practices

### 1. Keep Daemon Running

The daemon captures patterns automatically. Run it during development:

```bash
nc daemon start
```

### 2. Tag Your Patterns

Good tags make patterns findable:

```bash
nc patterns tag <id> "kubernetes" "deployment" "rollback"
```

### 3. Share Team Patterns

Export high-value patterns for your team:

```bash
# Weekly export of top patterns
nc patterns export --since "1 week ago" --min-value 30 team-week.json
```

### 4. Review Captured Patterns

Periodically review what's being captured:

```bash
# Patterns from last week
nc patterns list --since "1 week ago"
```

---

*See [Session Intelligence](/docs/features/session-intelligence) for how patterns integrate with session tracking.*
