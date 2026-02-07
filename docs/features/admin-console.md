---
sidebar_position: 5
title: Admin Console
description: Interactive terminal UI for monitoring NC operations
---

# Admin Console (TUI)

The Admin Console is Neural Commander's interactive terminal dashboard. It provides real-time visibility into daemon operations, session tracking, intelligence extractions, and alerts - all from a single keyboard-driven interface.

Built on the [Bubble Tea](https://github.com/charmbracelet/bubbletea) framework with [Lipgloss](https://github.com/charmbracelet/lipgloss) styling.

## Quick Start

```bash
# Launch the console
ncmd admin
```

Press number keys to switch between views:

| Key | View | What It Shows |
|-----|------|---------------|
| `1` | Dashboard | System overview, counts, recent activity |
| `2` | Monitor | Live event stream from NC daemon |
| `3` | Intelligence | Browse extracted intelligence |
| `4` | Sessions | Claude Code session tracking |
| `5` | Alerts | Active alerts from CLAUDE.md |

Press `q` to exit.

## Views

### Dashboard

Bird's-eye view of NC operations showing event counts, intelligence extraction stats, active sessions, and alert summary.

```
╔══════════════════════════════════════════════════════════════╗
║                Neural Commander Admin Console                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  System Status: ✅ HEALTHY        Memory: 12.3% [OK]         ║
║                                                               ║
║  Events: 1,247     Intelligence: 89    Sessions: 3            ║
║  Alerts: 1 (0 critical, 1 warning)                            ║
║                                                               ║
║  Recent Events:                                               ║
║  14:32:15 INTELLIGENCE Pattern extracted: error handling       ║
║  14:32:10 FILE_UPDATE  Modified: main.go                      ║
║  14:32:05 HEALTH_CHECK System healthy                         ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

### Monitor

Live stream of NC daemon events with scrolling, pause/resume, and filtering.

```
╔══════════════════════════════════════════════════════════════╗
║  Monitor - Live Events                  ▶ STREAMING (Space)   ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  14:35:42  [INTELLIGENCE]  neural-commander                   ║
║           Pattern extracted: error recovery in daemon.go       ║
║                                                               ║
║  14:35:41  [FILE_UPDATE]   neural-commander                   ║
║           Modified: internal/daemon/controller.go              ║
║                                                               ║
║  14:35:38  [HEALTH_CHECK]  system                             ║
║           CPU: 42% | Memory: 8.2GB | Goroutines: 18          ║
║                                                               ║
║  Events: 1,247 | Buffer: 42% | Rate: 12/sec                  ║
╚══════════════════════════════════════════════════════════════╝
```

**Controls**: `Space` to pause/resume, `Up/Down` to scroll, `End` to resume auto-scroll.

### Intelligence

Browse intelligence extractions sorted by confidence score.

| Icon | Type | Description |
|------|------|-------------|
| Pattern | Recurring code patterns | Detected in your codebase |
| Decision | Architecture decisions | Captured from sessions |
| Practice | Best practices | Recommended approaches |
| Insight | Observations | Contextual insights |

### Sessions

Track Claude Code sessions across your projects with state filtering.

| Status | Meaning |
|--------|---------|
| Active | Session in use (< 2 min since activity) |
| Idle | Inactive (2-5 minutes) |
| Crashed | Terminated unexpectedly (> 5 minutes, no process) |

Press `f` to cycle filters: All, Active, Idle, Crashed.

### Alerts

View NC Active Alerts parsed from your project's CLAUDE.md file, showing severity, ID, title, and details.

Press `f` to filter by severity: All, Critical, Warning, Info.

## Safety Controls

The Admin Console includes built-in resource protection:

| Control | Setting | Purpose |
|---------|---------|---------|
| Event Buffer | 1,000 events / 50 MB | Bounded storage with FIFO eviction |
| Batch Processor | 1-second window | Aggregates high-volume events |
| Rate Limiter | 60 events/sec, 10 FPS | Prevents UI overload |
| Memory Monitor | 200 MB max | Hard limit with auto-GC on breach |

These ensure the console never overwhelms your system, even with 1,000+ events per second.

## Data Sources

The console reads from four sources (all read-only):

| Source | Location | View |
|--------|----------|------|
| Daemon events | `~/.neural-commander/daemon.log` | Monitor, Dashboard |
| Intelligence DB | `~/.neural-commander/intelligence.db` | Intelligence |
| Claude sessions | `~/.claude/projects/` | Sessions |
| Alert sections | Project `CLAUDE.md` | Alerts |

All data sources are optional. The console gracefully handles missing sources with empty views.

## Keyboard Reference

### Global Keys

| Key | Action |
|-----|--------|
| `1`-`5` | Switch views |
| `q` / `Ctrl+C` | Quit |

### Navigation

| Key | Action |
|-----|--------|
| `Up` / `k` | Move up |
| `Down` / `j` | Move down |
| `Home` | Jump to top |
| `End` | Jump to bottom |
| `PgUp/PgDown` | Scroll page |

### View-Specific

| Key | View | Action |
|-----|------|--------|
| `Space` | Monitor | Pause/resume stream |
| `f` | Sessions, Alerts | Cycle filter |
| `r` | Sessions, Alerts | Refresh data |

## Prerequisites

- NC daemon running: `ncmd daemon start`
- Terminal with 256-color support

## Troubleshooting

### No Events in Monitor

1. Check daemon is running: `ncmd daemon status`
2. Verify log exists: `ls ~/.neural-commander/daemon.log`
3. Trigger activity by modifying a file in a monitored project

### High Memory Warning

Header shows `Memory: 85% [WARNING]` - this is normal during high event volume. The console auto-manages memory at 95% (clears buffer + runs garbage collection).

### Sessions Not Showing

Verify Claude Code sessions exist: `ls ~/.claude/projects/`

---

*The Admin Console is part of NC's observability layer. It pairs with [Active Alerts](/docs/features/active-alerts) for notifications and [Session Intelligence](/docs/features/session-intelligence) for session management.*
