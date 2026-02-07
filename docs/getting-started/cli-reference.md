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
ncmd audit

# Audit specific path
ncmd audit /path/to/project

# Quick scan (fast, <30s target)
ncmd audit --quick

# Save report to markdown file
ncmd audit -o
ncmd audit --output
```

### Output Options

```bash
# Summary output (default)
ncmd audit

# Full markdown report to stdout
ncmd audit --format markdown

# JSON output for programmatic use
ncmd audit --format json

# Save markdown to file (auto-generated filename)
ncmd audit -o
# Creates: YYYYMMDD-HHMMSS-projectname-audit.md

# Save to specific directory
ncmd audit -o ./reports/

# Save to specific filename
ncmd audit -o my-audit-report.md
```

### Scan Options

```bash
# Quick scan - skips heavy directories, max depth 5
ncmd audit --quick

# Focus on subdirectory
ncmd audit --focus neural-commander-go

# Include external repositories
ncmd audit --include-external

# Verbose output
ncmd audit -v
ncmd audit --verbose

# Don't save to .audit/ directory
ncmd audit --save=false
```

### Combining Options

```bash
# Quick scan with markdown export
ncmd audit --quick -o

# Full scan focused on subdirectory, save report
ncmd audit --focus src -o ./reports/

# Verbose JSON output
ncmd audit -v --format json
```

## Session Commands

```bash
# List all sessions
ncmd session list

# Show session details
ncmd session show <session-id>

# Resume a session
ncmd session resume <session-id>
```

## Claude Session Commands

```bash
# List Claude Code sessions
ncmd claude-session list

# Show crashed sessions
ncmd claude-session list --crashed

# Resume crashed session
ncmd claude-session resume <session-id>
```

## Daemon Commands

```bash
# Start background daemon
ncmd daemon start

# Stop daemon
ncmd daemon stop

# Check daemon status
ncmd daemon status
```

## Other Commands

```bash
# Show version
ncmd version

# Show help
ncmd help
ncmd --help

# Chat with AI (requires Ollama)
ncmd chat "Your prompt here"
ncmd chat --stream "Your prompt"
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
