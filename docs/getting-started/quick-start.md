---
sidebar_position: 1
title: Quick Start
description: Get Neural Commander up and running in 5 minutes
---

# Quick Start

Get Neural Commander running in under 5 minutes.

## Prerequisites

- **Go 1.21+** (for building from source)
- **Ollama** (for local AI models) - [Install Ollama](https://ollama.ai)
- **Git** (for cloning the repository)

## Installation

### Option 1: Download Binary (Recommended)

```bash
# Linux
curl -L https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-linux -o nc
chmod +x nc
sudo mv nc /usr/local/bin/

# macOS
curl -L https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-mac -o nc
chmod +x nc
sudo mv nc /usr/local/bin/

# Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander.exe" -OutFile "nc.exe"
```

### Option 2: Build from Source

```bash
git clone https://github.com/angelsintheai/neural-commander.git
cd neural-commander/neural-commander-go
go build -o nc ./cmd/nc
```

## Verify Installation

```bash
nc version
# Neural Commander v0.99 (Community Edition)
```

## Start Using Neural Commander

### 1. Start the API Server

```bash
nc --api
# Server running on http://localhost:7669
```

### 2. Chat with AI

```bash
# Simple chat
nc chat "Write a Python function to reverse a string"

# Or via API
curl -X POST http://localhost:7669/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain async/await in JavaScript"}'
```

### 3. Scan a Project

```bash
nc audit /path/to/your/project
# Generates project health report with recommendations
```

### 4. View Sessions

```bash
nc session list
# Shows all your AI sessions with context
```

## What's Next?

- **[Installation Guide](/docs/getting-started/installation)** - Detailed setup for all platforms
- **[Configuration](/docs/getting-started/configuration)** - Customize NC for your workflow
- **[Session Intelligence](/docs/features/session-intelligence)** - Understand NC's context preservation
- **[API Reference](/docs/features/api-server)** - Full API documentation

## Quick Tips

- NC automatically selects the best model for your task
- Sessions persist across restarts - pick up where you left off
- Use `nc --help` to see all available commands
- The daemon runs in background for real-time project monitoring

---

*Need help? Check our [Troubleshooting Guide](/docs/getting-started/troubleshooting) or [open an issue](https://github.com/angelsintheai/neural-commander/issues).*
