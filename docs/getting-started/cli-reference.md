---
sidebar_position: 5
title: CLI Reference
description: Complete command reference for Neural Commander
---

# CLI Reference

Neural Commander provides a comprehensive CLI for project health scanning and AI orchestration.

## Audit Commands

The `audit` command is the core of Neural Commander, providing comprehensive project health analysis.

### Basic Usage

```bash
# Audit current directory
nc audit

# Audit specific path
nc audit /path/to/project

# Quick scan (fast, <30s target)
nc audit --quick

# Save report to markdown file
nc audit -o
nc audit --output
```

### Output Options

```bash
# Summary output (default)
nc audit

# Full markdown report to stdout
nc audit --format markdown

# JSON output for programmatic use
nc audit --format json

# Save markdown to file (auto-generated filename)
nc audit -o
# Creates: YYYYMMDD-HHMMSS-projectname-audit.md

# Save to specific directory
nc audit -o ./reports/

# Save to specific filename
nc audit -o my-audit-report.md
```

### Scan Options

```bash
# Quick scan - skips heavy directories, max depth 5
nc audit --quick

# Focus on subdirectory
nc audit --focus neural-commander-go

# Include external repositories
nc audit --include-external

# Verbose output
nc audit -v
nc audit --verbose

# Don't save to .audit/ directory
nc audit --save=false
```

### Combining Options

```bash
# Quick scan with markdown export
nc audit --quick -o

# Full scan focused on subdirectory, save report
nc audit --focus src -o ./reports/

# Verbose JSON output
nc audit -v --format json
```

## Session Commands

```bash
# List all sessions
nc session list

# Show session details
nc session show <session-id>

# Resume a session
nc session resume <session-id>
```

## Claude Session Commands

```bash
# List Claude Code sessions
nc claude-session list

# Show crashed sessions
nc claude-session list --crashed

# Resume crashed session
nc claude-session resume <session-id>
```

## Daemon Commands

```bash
# Start background daemon
nc daemon start

# Stop daemon
nc daemon stop

# Check daemon status
nc daemon status
```

## Other Commands

```bash
# Show version
nc version

# Show help
nc help
nc --help

# Chat with AI (requires Ollama)
nc chat "Your prompt here"
nc chat --stream "Your prompt"
```

## Global Flags

These flags work with all commands:

| Flag | Description |
|------|-------------|
| `--help`, `-h` | Show help for command |
| `--version` | Show version |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NC_DATA_DIR` | Data directory | `~/.neural-commander` |
| `OLLAMA_HOST` | Ollama API endpoint | `http://localhost:11434` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |

---

*For more details on specific features, see the [Features documentation](/docs/features/session-intelligence).*
