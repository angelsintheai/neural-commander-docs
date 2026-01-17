---
sidebar_position: 1
title: Quick Start
description: Get Neural Commander up and running in 5 minutes
---

# Quick Start

Get Neural Commander running in under 5 minutes.

:::info Alpha Release
Neural Commander v0.98.1 is currently in **private alpha**. To access the releases, [request alpha access](/alpha) first.
:::

## Prerequisites

- **Ollama** (recommended for local AI models) - [Install Ollama](https://ollama.ai)
- **Git** (optional, for build from source)

## Installation

### Step 1: Download Binary

Go to the [releases page](https://github.com/angelsintheai/neural-commander/releases/tag/v0.98.1) and download for your platform:

| Platform | File |
|----------|------|
| Linux (Intel/AMD) | `neural-commander-linux-amd64` |
| Linux (ARM) | `neural-commander-linux-arm64` |
| macOS (Intel) | `neural-commander-darwin-amd64` |
| macOS (M1/M2/M3) | `neural-commander-darwin-arm64` |
| Windows | `neural-commander-windows-amd64.exe` |

### Step 2: Install

**Linux / macOS:**

```bash
# Make executable
chmod +x neural-commander-*

# Move to PATH
mv neural-commander-linux-amd64 ~/.local/bin/nc
# OR for macOS:
# mv neural-commander-darwin-arm64 ~/.local/bin/nc

# Ensure ~/.local/bin is in PATH
echo 'export PATH=$PATH:~/.local/bin' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**

```powershell
# Create directory if needed
mkdir $env:USERPROFILE\.local\bin -ErrorAction SilentlyContinue

# Move binary
Move-Item neural-commander-windows-amd64.exe $env:USERPROFILE\.local\bin\nc.exe

# Add to PATH
$env:PATH += ";$env:USERPROFILE\.local\bin"
```

### Step 3: Verify Installation

```bash
nc version
# Neural Commander v0.98.1
# Edition: Community Edition
```

## Start Using Neural Commander

### 1. Run a Quick Audit

```bash
cd /path/to/your/project

# Fast scan (recommended first time)
nc audit --quick

# Save report to markdown file
nc audit --quick -o

# Full scan (more thorough, takes longer)
nc audit
```

This scans your project for:
- Documentation health
- Git metrics
- Code quality indicators (TODO/FIXME/HACK)
- Requirements coverage

The `-o` flag saves a markdown report with auto-generated filename like `20260117-143022-projectname-audit.md`.

### 2. Start the Daemon

```bash
nc daemon start
```

The daemon enables:
- Session monitoring
- Real-time alerts
- API server (port 7669)

### 3. View Admin Console

```bash
nc admin
```

A terminal UI dashboard showing:
- System status
- Active sessions
- Event stream

Press `q` to exit.

### 4. Check Claude Sessions

If you use Claude Code:

```bash
nc claude-session list
```

Shows your Claude Code sessions with crash detection.

### 5. Chat with AI (Optional)

```bash
# Requires Ollama running
nc chat "Write a Python function to reverse a string"
```

## What's Next?

- **[Installation Guide](/docs/getting-started/installation)** - Detailed setup for all platforms
- **[Configuration](/docs/getting-started/configuration)** - Customize NC for your workflow
- **[Session Intelligence](/docs/features/session-intelligence)** - Understand NC's context preservation
- **[API Reference](/docs/features/api-server)** - Full API documentation

## Quick Tips

- NC works with zero configuration out of the box
- Sessions persist across restarts - pick up where you left off
- Use `nc --help` to see all available commands
- The daemon runs in background for real-time project monitoring

---

*Need help? Check our [Troubleshooting Guide](/docs/getting-started/troubleshooting) or [submit feedback](https://github.com/angelsintheai/neural-commander/issues).*
