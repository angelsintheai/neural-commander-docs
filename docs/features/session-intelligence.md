---
sidebar_position: 1
title: Session Intelligence
description: Context preservation across AI interactions
---

# Session Intelligence

Session Intelligence is Neural Commander's system for preserving context across AI interactions, enabling continuity that survives session crashes, context limits, and project switching.

## The Problem

Traditional AI tools lose context when:
- Sessions crash or timeout
- Token limits are exceeded
- You switch between projects
- Days pass between interactions

This forces developers to repeatedly explain context, wasting time and breaking flow.

## How NC Solves This

Neural Commander persists:

- **Conversation history** with full message threads
- **Project context** including file structure and patterns
- **Decisions made** during development sessions
- **Learnings captured** from successful patterns
- **Active state** like todos and current focus

## Session Lifecycle

```
┌─────────────────────────────────────────────┐
│                SESSION                       │
├─────────────────────────────────────────────┤
│  Created → Active → Suspended → Resumed     │
│                 ↓                            │
│              Crashed → Recovered             │
└─────────────────────────────────────────────┘
```

### States

| State | Description |
|-------|-------------|
| Active | Currently in use |
| Suspended | Saved, not in use |
| Crashed | Unexpected termination detected |
| Recovered | Restored from crash state |
| Archived | Old session, retained for history |

## Using Sessions

### View Sessions

```bash
nc session list
```

```
ID        PROJECT                   MESSAGES  LAST ACTIVITY
bd5adee7  neural-commander          42        2 hours ago
a1b2c3d4  my-api-project            18        yesterday
f5e6d7c8  docs-site                 7         3 days ago
```

### Resume a Session

```bash
# Resume most recent
nc session resume

# Resume specific session
nc session resume bd5adee7
```

### Create New Session

```bash
nc session new my-new-project
```

### View Session Details

```bash
nc session show bd5adee7
```

## Crash Recovery

When a session crashes, NC automatically:

1. **Detects the crash** via daemon monitoring
2. **Preserves all state** from the last known good point
3. **Marks as recoverable** for later resumption
4. **Generates recovery context** summarizing the session

### Recovery Flow

```bash
# Check for crashed sessions
nc session crashed

# Recover a crashed session
nc session recover bd5adee7
```

The recovered session includes:
- Full conversation history
- Summary of what was being worked on
- Any uncommitted decisions or todos
- Files that were being modified

## Context Injection

NC can inject session context into your AI prompts:

### Manual Injection

```bash
# Get context summary
nc context summary

# Include in prompt
nc chat "Continue from where we left off" --with-context
```

### Automatic Context (API)

```bash
curl -X POST http://localhost:7669/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What were we working on?",
    "session_id": "bd5adee7"
  }'
```

## Session Data

Sessions are stored in `~/.neural-commander/sessions/` as JSON files:

```json
{
  "id": "bd5adee7-e606-4cc7-ba18-266dace8aad6",
  "project": "neural-commander",
  "created_at": "2025-10-10T14:33:08Z",
  "updated_at": "2025-10-10T16:45:22Z",
  "messages": [...],
  "context": {
    "files_touched": ["main.go", "api.go"],
    "decisions": ["Use REST instead of GraphQL"],
    "todos": ["Add error handling"]
  }
}
```

## Best Practices

### 1. Use Project-Specific Sessions

```bash
cd /path/to/project
nc session new $(basename $(pwd))
```

### 2. Resume Don't Restart

```bash
# Good - maintains context
nc session resume

# Avoid - loses context
nc session new duplicate-project
```

### 3. Capture Important Decisions

When you make a significant decision during a session, NC captures it automatically. You can also manually note:

```bash
nc learn "Use PostgreSQL for persistence"
```

### 4. Archive Old Sessions

```bash
# Archive sessions older than 30 days
nc session archive --older-than 30d
```

## Auto-Session Tracking

NC can automatically detect and track Claude Code sessions without manual intervention.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                  Auto-Session Detection                      │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Claude  │    │   NC     │    │ Session  │              │
│  │   Code   │───▶│  Daemon  │───▶│  Store   │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│       │               │                │                    │
│       │    Watches    │    Extracts    │                    │
│       │   .claude/    │   session ID,  │                    │
│       │    files      │   project,     │                    │
│       │               │   activity     │                    │
│       │               │                │                    │
│       ▼               ▼                ▼                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Real-time Session Data                   │  │
│  │  • Session start/end times                           │  │
│  │  • Message counts                                     │  │
│  │  • Active working directory                          │  │
│  │  • Files being modified                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Enable Auto-Tracking

Auto-tracking is enabled by default when the daemon runs:

```bash
# Start daemon (auto-tracking included)
nc daemon start

# Check tracking status
nc daemon status
```

**Output includes**:
```
Claude Session Detection: ACTIVE
Sessions detected: 3
Active sessions: 1
```

### What Gets Tracked

| Data | Description |
|------|-------------|
| Session ID | Unique identifier from Claude Code |
| Project | Working directory / project name |
| Start Time | When session began |
| Last Activity | Most recent interaction |
| Message Count | Number of exchanges |
| Status | active, suspended, crashed |

### View Tracked Sessions

```bash
# List Claude Code sessions
nc claude-session list

# View specific session
nc claude-session show <session-id>

# Show active session
nc claude-session active
```

### Watch Mode

Monitor sessions in real-time:

```bash
nc claude-session watch
```

**Output**:
```
Watching Claude Code sessions... (Ctrl+C to stop)

[14:32:15] Session abc123 STARTED in neural-commander
[14:35:42] Session abc123: 5 messages exchanged
[14:38:11] Session abc123: Working on main.go
[14:45:00] Session abc123 SUSPENDED
```

### Crash Detection

When a Claude Code session crashes unexpectedly:

1. NC detects the abnormal termination
2. Marks session as "crashed" with last known state
3. Preserves context for recovery
4. Alerts you on next `nc status` check

```bash
# Check for crashed sessions
nc claude-session crashed

# Output:
# CRASHED SESSIONS
# ================
# abc123  neural-commander  42 messages  crashed 2h ago
#   Last activity: Implementing user auth
#   Files: auth.go, middleware.go
```

### Hybrid State Detection (v0.98.3+)

NC uses a **hybrid approach** to determine session state, combining:

1. **File modification time** - Primary indicator from `.jsonl` session files
2. **Process detection** - Verifies if Claude Code is actually running

This hybrid approach solves reliability issues, especially on WSL2 where file system caching can cause stale modification times.

**How it works:**
- If file was modified < 2 minutes ago → **Active**
- If file was modified < 5 minutes ago → **Idle**
- If file was modified > 5 minutes ago:
  - Check if Claude process is running for the project
  - If process found → **Active** (override stale file time)
  - If no process → **Crashed**

This ensures that `nc claude-session list` and `nc claude-session show` always report consistent state.

### Configuration

```bash
# Set detection interval (seconds)
nc config set claude_session.detect_interval 30

# Set crash timeout (detect crash after N seconds inactive)
nc config set claude_session.crash_timeout 300

# Enable/disable notifications
nc config set claude_session.notifications true
```

### API Endpoints

#### GET /api/claude-sessions

List all tracked Claude Code sessions.

```bash
curl http://localhost:7669/api/claude-sessions
```

#### GET /api/claude-sessions/active

Get currently active session.

```bash
curl http://localhost:7669/api/claude-sessions/active
```

#### GET /api/claude-sessions/crashed

List crashed sessions awaiting recovery.

```bash
curl http://localhost:7669/api/claude-sessions/crashed
```

## API Reference

### GET /api/sessions

List all sessions.

### GET /api/sessions/active

Get the currently active session.

### POST /api/sessions

Create a new session.

### GET /api/sessions/:id

Get session details.

### POST /api/sessions/:id/resume

Resume a suspended session.

### POST /api/sessions/:id/recover

Recover a crashed session.

---

*See [Data Models](/docs/architecture/data-models) for session storage details.*
