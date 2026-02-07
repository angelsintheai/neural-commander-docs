---
sidebar_position: 3
title: Configuration
description: Configure Neural Commander for your workflow
---

# Configuration

Neural Commander stores configuration in `~/.neural-commander/` with sensible defaults that work out of the box.

## Configuration Files

```
~/.neural-commander/
├── config.yaml          # Main configuration
├── sessions/             # Session data
├── learnings/            # Captured patterns
└── daemon.log           # Daemon logs
```

## Main Configuration

Create or edit `~/.neural-commander/config.yaml`:

```yaml
# API Server
api:
  port: 7669
  host: localhost
  cors_enabled: true

# Ollama Integration
ollama:
  host: http://localhost:11434
  default_model: llama3.2:3b
  code_model: codellama:7b
  timeout: 120s

# Session Management
sessions:
  retention_days: 90
  auto_resume: true
  max_sessions: 100

# Resource Limits
resources:
  max_cpu_percent: 50
  max_memory_mb: 2048
  circuit_breaker: true

# Daemon
daemon:
  auto_start: false
  watch_interval: 30s
  log_level: info
```

## Environment Variables

Override config with environment variables:

```bash
export NC_API_PORT=8080
export NC_OLLAMA_HOST=http://localhost:11434
export NC_LOG_LEVEL=debug
```

## Project-Level Configuration

Create `.nc/config.yaml` in your project root:

```yaml
# Project-specific settings
project:
  name: my-project
  type: go  # go, python, node, rust

# Custom model routing
models:
  default: codellama:13b
  documentation: llama3.2:3b

# Ignore patterns
ignore:
  - vendor/
  - node_modules/
  - .git/
  - "*.min.js"
```

## CLI Options

Most config options can be overridden via CLI:

```bash
# Start unified daemon (REST API on 7669, MCP on 7671)
ncmd daemon

# Daemon without REST API (MCP only)
ncmd daemon --no-api

# Suppress resource governor messages
ncmd -q daemon

# Specific model for chat
ncmd chat "question" --model codellama:13b
```

## Configuration Precedence

1. **CLI flags** (highest priority)
2. **Environment variables**
3. **Project config** (`.nc/config.yaml`)
4. **User config** (`~/.neural-commander/config.yaml`)
5. **Default values** (lowest priority)

## Common Configurations

### Development Machine

```yaml
resources:
  max_cpu_percent: 75
  max_memory_mb: 4096

api:
  port: 7669

daemon:
  auto_start: true
```

### Resource-Constrained Environment

```yaml
resources:
  max_cpu_percent: 25
  max_memory_mb: 1024
  circuit_breaker: true

ollama:
  default_model: llama3.2:1b
  timeout: 60s
```

### Multi-Project Setup

```yaml
sessions:
  max_sessions: 200
  retention_days: 180

daemon:
  watch_interval: 60s
```

## Validating Configuration

```bash
# Check config
ncmd config validate

# Show effective config
ncmd config show

# Reset to defaults
ncmd config reset
```

---

*See [Troubleshooting](/docs/getting-started/troubleshooting) for configuration issues.*
