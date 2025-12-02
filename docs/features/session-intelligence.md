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
