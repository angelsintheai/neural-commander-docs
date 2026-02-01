---
sidebar_position: 2
title: Requirements Manager
description: Track and manage project requirements with YAML and SQLite
---

# Requirements Manager

The Requirements Manager helps you define, track, and validate project requirements throughout development. It uses YAML files for definitions, SQLite for persistence, and generates context for Claude Code sessions so the AI understands what you're building.

## How It Works

```
YAML Requirements          Requirements Manager           Claude Code
┌──────────────┐         ┌────────────────────┐         ┌────────────┐
│ REQ-NC-001   │──import─▶│  SQLite Database   │──context▶│ Knows your │
│ REQ-NC-006   │         │  Track, Query,     │         │ requirements│
│ REQ-NC-012   │         │  Validate, Export  │         │ priorities  │
│ ...          │◀─export──│                    │         │ violations  │
└──────────────┘         └────────────────────┘         └────────────┘
```

## Quick Start

### 1. Check System Health

```bash
nc req health
```

```
Requirements Manager Health
===========================
Requirements loaded:  89
Validation rules:     34
Active violations:    2
Status: HEALTHY
```

### 2. List Requirements

```bash
nc req list
```

```
ID            SEVERITY   STATUS         TITLE
REQ-NC-001    CRITICAL   IMPLEMENTED    Resource Governor Safety
REQ-NC-006    HIGH       ACTIVE         Session Intelligence
REQ-NC-012    HIGH       PARTIAL        Requirements Manager
...
Total: 89 requirements
```

### 3. Generate Context for Claude Code

```bash
nc req context --output .claude/context.md
```

Claude Code reads this file to understand your requirements, priorities, and what needs work.

## Requirement YAML Format

### Creating a Requirement

```yaml
id: REQ-NC-060
title: My New Feature
description: |
  Detailed description of what this requirement covers.
context: |
  Why this requirement exists and how it fits
  into the broader system.
category: FUNCTIONAL
severity: HIGH
status: DRAFT
related_files:
  - internal/myfeature/handler.go
  - cmd/nc/commands/myfeature.go
related_tests:
  - internal/myfeature/handler_test.go
dependencies:
  - REQ-NC-020
acceptance_criteria:
  - Feature works end-to-end
  - Tests pass with >80% coverage
  - Documentation updated
validation_rules:
  - type: PATTERN
    pattern: "func.*Handler"
    message: Handler function must exist
tags: [my-feature, new]
author: Your Name
version: 1
```

### ID Convention

```
REQ-{PREFIX}-{NUMBER}

Prefixes:
  NC     = Neural Commander core features
  DOCS   = Documentation Intelligence
  INTEL  = Intelligence/LLM features
  AUDIT  = Audit system
  DEX    = Dexinator (trading bot)
```

### Categories

| Category | When to Use |
|----------|-------------|
| `FUNCTIONAL` | Feature behavior |
| `NON_FUNCTIONAL` | Performance, scalability |
| `ARCHITECTURAL` | Design constraints |
| `SECURITY` | Auth, data protection |
| `COMPLIANCE` | Regulatory |
| `DATA_INTEGRITY` | Data consistency |
| `OPERATIONAL` | Deployment, monitoring |
| `USER_EXPERIENCE` | Usability |
| `TESTING` | Test coverage |
| `DOCUMENTATION` | Documentation standards |

### Severities

| Severity | Weight | When to Use |
|----------|--------|-------------|
| `CRITICAL` | 100 | System fails without this |
| `HIGH` | 75 | Major functionality impact |
| `MEDIUM` | 50 | Moderate impact, workarounds exist |
| `LOW` | 25 | Nice-to-have |

### Status Workflow

```
DRAFT --> ACTIVE --> IMPLEMENTED
                        |
                    PARTIAL --> ACTIVE (rework)
                        |
                    BLOCKED --> ACTIVE (unblocked)

ACTIVE --> DEPRECATED (no longer needed)
ACTIVE --> SUPERSEDED (replaced)
```

## CLI Commands

### List Requirements

```bash
# List all
nc req list

# Filter by category, severity, or status
nc req list --category SECURITY
nc req list --severity CRITICAL
nc req list --status ACTIVE

# Combine filters
nc req list --category FUNCTIONAL --severity HIGH --status ACTIVE

# Filter by tags
nc req list --tags security,authentication

# Limit results
nc req list --limit 10
```

### Show Requirement Details

```bash
nc req show REQ-NC-012
```

### Import Requirements

```bash
# Import a single file
nc req import requirements.yaml

# Import with merge (update existing)
nc req import requirements.yaml --merge

# Import entire directory
nc req import docs/06-planning/requirements/
```

### Export Requirements

```bash
# Export all
nc req export all-requirements.yaml

# Export filtered
nc req export security-reqs.yaml --category SECURITY
```

### Generate Session Context

```bash
# Standard output
nc req context --output .claude/context.md

# Compact mode (60% smaller)
nc req context --compact --output .claude/context.md

# Include code examples
nc req context --examples

# JSON output
nc req context --json
```

### View Statistics

```bash
nc req stats
```

```
By Severity:
  CRITICAL:  12 (13.5%)
  HIGH:      34 (38.2%)
  MEDIUM:    28 (31.5%)
  LOW:       15 (16.8%)

By Status:
  IMPLEMENTED: 42 (47.2%)
  ACTIVE:      23 (25.8%)
  PARTIAL:     12 (13.5%)

Implementation Rate: 47.2%
```

### Convert Formats

```bash
# Convert Track B (single-req) to Track A (multi-req) format
nc req convert REQ-NC-012.yaml --output converted/

# Convert directory
nc req convert --dir requirements/ --output converted/
```

## Session Context Integration

The most powerful feature is generating context for Claude Code:

```bash
# Before starting Claude Code work
nc req context --output .claude/context.md
```

The generated context includes:
- **Summary**: Total count, critical count, implementation rate
- **Critical Requirements**: What must not break
- **Unimplemented**: What still needs work
- **Recent Violations**: What needs fixing
- **Status Breakdown**: Full picture of progress

### Compact vs Full Mode

- **Full mode** (default): Detailed descriptions, examples, validation rules
- **Compact mode** (`--compact`): 60% smaller, IDs + titles + statuses only

## Track A / Track B Architecture

The Requirements Manager uses a dual-track system:

| Track | System | Role |
|-------|--------|------|
| **Track A** | Requirements Manager | Core lifecycle - create, track, validate |
| **Track B** | Document Intelligence | Enrichment - doc links, cross-references |

Track A manages requirements. Track B adds documentation intelligence. They communicate via NC's event bus, so when a requirement changes, documentation cross-references update automatically.

## API Reference

### GET /api/requirements

List requirements with optional filters.

```bash
curl "http://localhost:7669/api/requirements?category=SECURITY&severity=CRITICAL"
```

### GET /api/requirements/:id

Get requirement details.

### GET /api/requirements/stats

Get aggregate statistics.

### GET /api/requirements/health

Get system health status.

### POST /api/requirements/context

Generate session context.

```bash
curl -X POST http://localhost:7669/api/requirements/context \
  -d '{"compact": true, "max_critical": 5}'
```

## Best Practices

### 1. One Requirement Per YAML File

Easier to track in git, easier to review.

### 2. Keep Statuses Current

Update status immediately when implementation completes. Stale statuses reduce trust.

### 3. Link Requirements to Code

Always include `related_files` and `related_tests`.

### 4. Refresh Context Before Sessions

```bash
nc req context --output .claude/context.md
```

Stale context is worse than no context.

### 5. Use Dependencies

```yaml
dependencies:
  - REQ-NC-020  # Requires event bus
```

## Troubleshooting

### No Requirements Found

1. Import requirements: `nc req import docs/06-planning/requirements/`
2. Check YAML files exist in your requirements directory

### Import Validation Error

Use valid enum values for category (FUNCTIONAL, SECURITY, etc.), severity (CRITICAL, HIGH, MEDIUM, LOW), and status (DRAFT, ACTIVE, IMPLEMENTED, etc.).

### Empty Context Output

1. Check requirements are loaded: `nc req health`
2. Import requirements first if health shows 0

---

*The Requirements Manager integrates with [Session Intelligence](/docs/features/session-intelligence) for session context and [Active Alerts](/docs/features/active-alerts) for violation notifications.*
