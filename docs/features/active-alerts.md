---
sidebar_position: 10
title: Active Alerts
description: Real-time project awareness through CLAUDE.md injection
---

# Active Alerts

Active Alerts is NC's system for keeping Claude Code informed about your project's state in real-time. Instead of working blindly, NC monitors your projects and injects actionable alerts directly into your `CLAUDE.md` file—which Claude Code reads between tasks.

## What You Get

- **Real-time Awareness** - Claude Code knows when you have uncommitted code
- **Checkpoint Reminders** - Alerts when long sessions need saving
- **Requirements Validation** - Automatic checks against project requirements
- **Session Context** - Current project stats visible to Claude Code
- **Smart Guidance** - Actionable recommendations, not just warnings

## How It Works

```
You work on code
       │
       ▼
NC Daemon monitors (every 30s)
       │
       ├── Uncommitted code?
       ├── Long session without checkpoint?
       ├── Requirements violations?
       └── Large files in repo?
       │
       ▼
Updates CLAUDE.md alert section
       │
       ▼
Claude Code re-reads between tasks
       │
       ▼
Shows you alerts + recommends actions
       │
       ▼
You fix the issue → alert auto-dismisses
```

NC adds three sections to your CLAUDE.md:
1. **Active Alerts** - CRITICAL/WARNING/INFO alerts with session stats
2. **Protocol Directive** - Instructions for Claude Code on when to check alerts
3. **Prime Directives** - Non-negotiable project rules

## Alert Severities

### CRITICAL (Address Immediately)

| Alert | Trigger |
|-------|---------|
| Uncommitted code | Modified files older than 2 hours |
| Requirements violation | Code conflicts with defined requirements |
| Security issue | Secrets detected in code |
| Broken build | Build or tests failing |

### WARNING (Address Soon)

| Alert | Trigger |
|-------|---------|
| Uncommitted code | Modified files under 2 hours |
| Long session | No checkpoint for 2+ hours |
| Large files | Files exceeding size threshold |
| Low test coverage | Below project threshold |
| Stale documentation | Docs not updated with code |

### INFO (Nice to Know)

| Alert | Trigger |
|-------|---------|
| Session statistics | Periodic session summary |
| Optimization suggestions | Performance improvement tips |
| Best practices | Relevant coding tips |

## Quick Start

### 1. Initialize NC

```bash
nc init
```

Follow the prompts to:
- Select your projects directory
- Choose which projects to monitor
- Confirm alert installation

For headless setup:
```bash
nc init --yes --projects-dir ~/dev
```

### 2. Verify Alerts Are Working

```bash
# Check daemon is running
nc daemon status

# View current alerts
nc alerts list
```

### 3. See It In Action

Make a code change without committing. Within 30 seconds, check your CLAUDE.md — you'll see the uncommitted code alert appear.

## CLI Commands

### Alert Management

```bash
nc alerts list                              # Show all current alerts
nc alerts list --project my-project         # Alerts for specific project
nc alerts show ALERT-001                    # Show alert details
nc alerts dismiss ALERT-001                 # Dismiss specific alert
nc alerts snooze ALERT-001 --duration 1h    # Snooze for 1 hour
nc alerts refresh --project my-project      # Force update
```

### Project Management

```bash
nc projects list                            # List monitored projects
nc projects add my-project                  # Add project to monitoring
nc projects remove my-project               # Stop monitoring
nc projects show my-project                 # Show project details
nc projects uninstall my-project            # Remove NC from project
```

### Daemon Control

```bash
nc daemon status                            # Check daemon status
nc daemon start                             # Start daemon
nc daemon restart                           # Restart daemon
nc daemon install-service                   # Install as system service
```

## What CLAUDE.md Looks Like

When alerts are active, the top of your CLAUDE.md contains:

```markdown
<!-- NC-ALERTS-START -->
## NEURAL COMMANDER ACTIVE ALERTS

### CRITICAL (0)
_No critical alerts at this time_

### WARNING (1)

**[ALERT-NEU-UNCOMMITTED] Uncommitted Code Detected**
- **Detected**: 14:23:10
- **Modified Files**: 5
- **Recommended Action**: Consider committing your work

### INFO (0)
_No info alerts at this time_

## Current Session Stats
- **Files Modified**: 5 modified, 2 untracked
- **Last Commit**: abc1234 feat: add login page
- **Active Alerts**: 1 (0 CRITICAL, 1 WARNING, 0 INFO)
<!-- NC-ALERTS-END -->
```

Claude Code reads this between tasks and surfaces relevant alerts to you.

## Configuration

### Per-Project Settings

Edit `~/.nc/config.yaml`:

```yaml
monitored_projects:
  - name: my-project
    path: /home/user/dev/my-project
    alerts_enabled: true
    alert_config:
      uncommitted_threshold: 3600      # 1 hour (default: 7200)
      session_threshold: 5400          # 90 min (default: 7200)
      ignored_alert_types:
        - large_files                  # Don't alert about large files
```

### Disable Specific Detectors

```yaml
monitored_projects:
  - name: legacy-project
    disabled_detectors:
      - uncommitted_code               # Project doesn't use git
      - requirements                   # No requirements defined
```

### Auto-Start Daemon

```bash
# Linux/Mac: Add to ~/.bashrc or ~/.zshrc
if ! pgrep -x "neural-commander" > /dev/null; then
    nc daemon start &
fi
```

## Integration Examples

### Git Pre-Commit Hook

```bash
#!/bin/bash
# Block commits when CRITICAL alerts exist
if nc alerts list --severity CRITICAL --count > /dev/null 2>&1; then
    echo "CRITICAL NC alerts detected!"
    nc alerts list --severity CRITICAL
    exit 1
fi
```

### CI/CD (GitHub Actions)

```yaml
- name: Check NC Alerts
  run: |
    nc init --yes --projects-dir .
    if nc alerts list --severity CRITICAL --count; then
      echo "CRITICAL alerts detected"
      exit 1
    fi
```

## Key Innovation: CLAUDE.md Injection

What makes Active Alerts unique:

1. **Bidirectional Communication** - NC writes to CLAUDE.md, Claude Code reads it, takes action, NC detects resolution
2. **No New Tools Required** - Uses your existing CLAUDE.md and Claude Code's re-read behavior
3. **Atomic Updates** - NC modifies only its marked sections, never corrupts your content
4. **30-Second Responsiveness** - Daemon polls every 30s, Claude Code sees changes between tasks
5. **Smart Auto-Dismissal** - Alerts clear when the problem is actually fixed, not just acknowledged

## Best Practices

1. **Let alerts auto-dismiss** - Fix the issue rather than manually dismissing
2. **Address CRITICAL immediately** - Stop current work and fix
3. **Customize thresholds early** - Tune alert timing to your workflow
4. **Start daemon at boot** - Ensures continuous monitoring
5. **Check before committing** - Run `nc alerts list` before every commit

## Tier Features

| Feature | Community | Pro |
|---------|-----------|-----|
| CLAUDE.md injection | Yes | Yes |
| Uncommitted code alerts | Yes | Yes |
| Session checkpoint alerts | Yes | Yes |
| Alert dismiss/snooze | Yes | Yes |
| Daemon monitoring | Yes | Yes |
| **Requirements validation** | No | Yes |
| **Security scanning** | No | Yes |
| **Custom alert rules** | No | Yes |
| **CI/CD integration** | No | Yes |

## Troubleshooting

### Alerts Not Appearing

1. Check daemon is running: `nc daemon status`
2. Verify project is monitored: `nc projects list`
3. Force refresh: `nc alerts refresh --project my-project`

### CLAUDE.md Not Being Updated

1. Verify NC has write access to the file
2. Check for NC markers: look for `<!-- NC-ALERTS-START -->` in CLAUDE.md
3. Re-initialize: `nc projects uninstall my-project && nc projects add my-project`

### Too Many Alerts

1. Increase thresholds in config
2. Disable noisy detectors
3. Use `nc alerts snooze` for temporary suppression

## FAQ

**Q: Will NC modify my source code?**
A: No. NC only modifies CLAUDE.md files (specifically the NC-controlled sections). Your source code is never touched.

**Q: Can I use NC without Claude Code?**
A: Yes. Alerts appear in your CLAUDE.md file readable by any tool or editor. The real value comes from the NC + Claude Code integration.

**Q: Does NC work offline?**
A: Yes. NC runs entirely locally with no internet requirement for core functionality.

---

*Active Alerts is NC's foundation layer. It integrates with [Session Intelligence](/docs/features/session-intelligence) for session tracking, [Resource Governor](/docs/features/resource-governor) for resource warnings, and [Requirements Manager](/docs/features/requirements-manager) for violation alerts.*
