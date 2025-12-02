---
sidebar_position: 1
title: Architecture Overview
description: High-level system architecture of Neural Commander
---

# Architecture Overview

Neural Commander is built as a modular Go application with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI / API                             │
├─────────────────────────────────────────────────────────────┤
│  Commands    │   REST API    │   Daemon    │   TUI Admin    │
├──────────────┴───────────────┴─────────────┴────────────────┤
│                      Core Services                           │
├─────────────────────────────────────────────────────────────┤
│  Sessions  │  Learning  │  Requirements  │  Intelligence    │
├────────────┴────────────┴────────────────┴──────────────────┤
│                    Storage Layer                             │
├─────────────────────────────────────────────────────────────┤
│    SQLite    │    File Store    │    Config Store           │
├──────────────┴──────────────────┴───────────────────────────┤
│                  External Integrations                       │
├─────────────────────────────────────────────────────────────┤
│     Ollama     │     Git     │     File System              │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### CLI Layer (`cmd/nc/`)

The command-line interface provides:
- **Commands** - All user-facing operations (`chat`, `session`, `audit`, etc.)
- **Flags** - Configuration options and overrides
- **Output** - Formatted terminal output with colors

### API Server (`internal/api/`)

REST API for external integration:
- **Endpoints** - All functionality exposed via HTTP
- **CORS** - Cross-origin support for web clients
- **JSON** - Consistent request/response format

### Daemon (`internal/daemon/`)

Background process for:
- **File watching** - Monitor project changes
- **Session management** - Track active sessions
- **Alert injection** - Update CLAUDE.md with alerts

### Core Services

#### Session Manager (`internal/sessions/`)

Handles session lifecycle:
- Create, resume, suspend sessions
- Persist conversation history
- Crash detection and recovery

#### Learning System (`internal/learning/`)

Pattern extraction and storage:
- Capture learnings from sessions
- Cross-project pattern synthesis
- Recommendation generation

#### Requirements Manager (`internal/requirements/`)

Project requirements tracking:
- YAML-based requirement definitions
- Status tracking and validation
- AI-assisted generation

#### Intelligence Layer (`internal/intelligence/`)

AI integration and routing:
- Model selection based on task
- Prompt enhancement
- Response processing

### Storage Layer

#### SQLite (`internal/storage/`)

Structured data storage:
- Session metadata
- Learning patterns
- Configuration

#### File Store

File-based storage:
- Session JSON files
- Requirement YAML files
- Project configurations

## Data Flow

### Chat Request Flow

```
User Input → CLI/API → Intelligence Layer → Ollama
                            ↓
                     Session Manager
                            ↓
                     Store Response
                            ↓
                     Return to User
```

### Session Resume Flow

```
Resume Command → Session Manager → Load from Storage
                        ↓
              Check for Crash State
                        ↓
              Inject Context → Ready
```

## Directory Structure

```
neural-commander-go/
├── cmd/
│   └── nc/
│       ├── main.go           # Entry point
│       └── commands/         # CLI commands
├── internal/
│   ├── api/                  # REST API server
│   ├── daemon/               # Background daemon
│   ├── sessions/             # Session management
│   ├── learning/             # Learning system
│   ├── requirements/         # Requirements manager
│   ├── intelligence/         # AI routing
│   ├── storage/              # Database layer
│   ├── config/               # Configuration
│   └── tier/                 # Edition gating
├── pkg/                      # Public packages
└── dist/                     # Built binaries
```

## Configuration

Configuration is loaded in order of precedence:

1. CLI flags
2. Environment variables
3. Project config (`.nc/config.yaml`)
4. User config (`~/.neural-commander/config.yaml`)
5. Default values

## Extension Points

### Plugins

Future plugin system for:
- Custom commands
- New storage backends
- Alternative AI providers

### Hooks

Event hooks for:
- Pre/post chat processing
- Session lifecycle events
- Custom alerts

## Performance Considerations

- **Lazy loading** - Components initialized on demand
- **Connection pooling** - Reuse Ollama connections
- **Caching** - Session context cached in memory
- **Async I/O** - Non-blocking file operations

## Security

- **Local-first** - All data stays on machine
- **No telemetry** - No data sent to external servers
- **File permissions** - Respect OS security model
- **Tier gating** - Feature access control

---

*See [Data Models](/docs/architecture/data-models) for detailed schema information.*
