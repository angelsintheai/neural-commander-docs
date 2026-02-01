---
sidebar_position: 6
title: Troubleshooting
description: Common issues and solutions
---

# Troubleshooting Guide

**Version**: v0.99.0-beta

---

## Quick Diagnostics

```bash
# Check NC is working
nc version

# Check daemon status
nc daemon status

# Check API server
curl http://localhost:7669/health

# View recent logs
nc daemon logs --tail 50
```

---

## Common Issues

### 1. "nc: command not found"

**Cause**: Binary not in PATH

**Fix**:
```bash
# Option A: Add to PATH
export PATH=$PATH:~/.local/bin

# Option B: Use full path
~/.local/bin/nc version

# Option C: Create symlink
ln -s /path/to/neural-commander ~/.local/bin/nc
```

---

### 2. Daemon Won't Start

**Symptoms**: `nc daemon status` shows "not running"

**Check 1: Port in use**
```bash
lsof -i :7669
# If something else is using port 7669, kill it or change NC's port
```

**Check 2: Previous instance**
```bash
pkill -f neural-commander
nc daemon start
```

**Check 3: Permissions**
```bash
ls -la ~/.nc/
# Ensure you own the .nc directory
sudo chown -R $USER:$USER ~/.nc/
```

---

### 3. API Server Returns 404

**Symptoms**: `curl http://localhost:7669/api/status` returns 404

**Cause**: Daemon not running or wrong port

**Fix**:
```bash
# Start daemon
nc daemon start

# Verify port
nc daemon status
# Look for "API: localhost:7669"
```

---

### 4. Session Recovery Not Working

**Symptoms**: `nc claude-session list` shows no sessions

**Check 1: Claude Code running?**
```bash
ps aux | grep claude
# Claude Code must be running with active sessions
```

**Check 2: Session directory exists?**
```bash
ls ~/.claude/
# Should contain session files
```

**Check 3: Watcher enabled?**
```bash
nc daemon status
# Look for "Session Watcher: active"
```

---

### 5. High CPU/Memory Usage

**Symptoms**: NC using excessive resources

**Check current limits**:
```bash
nc daemon status
# Look for Resource Governor settings
```

**Adjust limits**:
```bash
# Set lower CPU limit
nc daemon start --max-cpu 50

# Set memory limit
nc daemon start --max-memory 2048
```

**Kill runaway process**:
```bash
pkill -9 -f neural-commander
```

---

### 6. Ollama Connection Failed

**Symptoms**: Chat commands fail with "connection refused"

**Check 1: Ollama running?**
```bash
curl http://localhost:11434/api/tags
# Should return list of models
```

**Check 2: Ollama port**
```bash
# Default is 11434, check if different
echo $OLLAMA_HOST
```

**Fix**: Start Ollama
```bash
ollama serve
# Or on systemd systems:
sudo systemctl start ollama
```

---

### 7. Feedback Command Fails

**Symptoms**: `nc feedback bug "..."` errors

**Check 1: Storage directory**
```bash
ls -la ~/.nc/data/
# feedback.db should exist after first use
```

**Check 2: Disk space**
```bash
df -h ~/.nc/
# Ensure space available
```

**Check 3: GitHub integration (if using --github)**
```bash
# Verify token is set
echo $NC_GITHUB_TOKEN
# Should not be empty
```

---

### 8. Admin Console Crashes

**Symptoms**: `nc admin` exits immediately or garbles terminal

**Check 1: Terminal compatibility**
```bash
echo $TERM
# Should be xterm-256color or similar
```

**Check 2: Terminal size**
```bash
# Minimum 80x24 required
stty size
```

**Fix**: Reset terminal
```bash
reset
# Or
stty sane
```

---

### 9. Audit Command Hangs

**Symptoms**: `nc audit` runs forever on large repos

**Cause**: Scanning too many files

**Fix**: Use quick mode
```bash
nc audit --quick
# Or limit scope
nc audit --category git
```

---

### 10. Permission Denied Errors

**Symptoms**: Various "permission denied" messages

**Check ownership**:
```bash
ls -la ~/.nc/
# All files should be owned by your user
```

**Fix**:
```bash
sudo chown -R $USER:$USER ~/.nc/
chmod -R 755 ~/.nc/
```

---

## WSL2-Specific Issues

### File System Caching

**Problem**: WSL2's file system layer can cache file metadata, causing:
- Stale modification times on session files
- Session state appearing "crashed" when actually active
- File changes not immediately visible

**Mitigation**: NC uses hybrid detection (file time + process check) to work around this.

**Manual Workaround**:
```bash
# Force file system sync
sync

# Touch a file to update parent directory
touch ~/.claude/.sync
```

### Process Detection Path Conversion

**Problem**: WSL2 paths (`/mnt/c/...`) don't match Windows paths in process listings.

**How NC Handles This**: Converts WSL paths to Windows-style paths when searching for processes:
- `/mnt/c/dev/projects/foo` → `c:\dev\projects\foo`

---

## Log Analysis

### Log Locations

| Log | Location |
|-----|----------|
| Daemon | `~/.nc/logs/daemon.log` |
| API | `~/.nc/logs/api.log` |
| Sessions | `~/.nc/logs/sessions.log` |

### Viewing Logs

```bash
# Recent daemon logs
tail -100 ~/.nc/logs/daemon.log

# Follow logs in real-time
tail -f ~/.nc/logs/daemon.log

# Search for errors
grep -i error ~/.nc/logs/*.log
```

---

## Diagnostic Commands

### Full System Check

```bash
#!/bin/bash
echo "=== NC Diagnostics ==="
echo "Version: $(nc version 2>&1 | head -1)"
echo "Daemon: $(nc daemon status 2>&1 | grep -E 'Status|API')"
echo "Disk: $(du -sh ~/.nc/ 2>/dev/null || echo 'N/A')"
echo "Ollama: $(curl -s http://localhost:11434/api/tags | head -c 50 || echo 'Not running')"
echo "Sessions: $(nc claude-session list 2>&1 | wc -l) found"
```

### Export Debug Bundle

```bash
# Create debug bundle for support
mkdir -p /tmp/nc-debug
cp ~/.nc/logs/*.log /tmp/nc-debug/
nc version > /tmp/nc-debug/version.txt
nc daemon status > /tmp/nc-debug/status.txt 2>&1
tar -czf nc-debug-$(date +%Y%m%d).tar.gz -C /tmp nc-debug
```

---

## Getting Help

1. **Check logs first**: Most issues have clues in `~/.nc/logs/`
2. **Search existing issues**: https://github.com/angelsintheai/neural-commander/issues
3. **Submit feedback**: `nc feedback bug "description of issue"`
4. **Community**: Telegram alpha group (if member)

---

## Reset NC (Nuclear Option)

If all else fails, reset to clean state:

```bash
# Backup first!
cp -r ~/.nc ~/.nc-backup-$(date +%Y%m%d)

# Remove data (keeps config)
rm -rf ~/.nc/data ~/.nc/logs

# Full reset (loses everything)
rm -rf ~/.nc

# Restart
nc daemon start
```

---

## Archived Issues (Fixed in v0.98.3)

:::info
These issues were resolved in v0.98.3 and should not occur in v0.99.0-beta or later. Documented here for reference only.
:::

<details>
<summary>11. CLAUDE.md Alerts Not Updating (fixed v0.98.3)</summary>

**Cause**: The `HasNCDirectives()` check was too strict — it required both `NC-ALERTS-START` markers AND a specific protocol directive that was never installed. Fixed by relaxing the check to only require alert markers.
</details>

<details>
<summary>12. Session State Inconsistency on WSL2 (fixed v0.98.3)</summary>

**Cause**: WSL2 file system caching caused stale modification times. Fixed with hybrid state detection: checks file modification time first, then verifies whether the Claude Code process is actually running before determining session state.
</details>

<details>
<summary>13. Project Status Path Duplication (fixed v0.98.3)</summary>

**Cause**: Path normalization was joining an already-complete path with the project name again, producing paths like `/mnt/c/dev/projects/project/project`. Fixed in path resolution logic.
</details>

<details>
<summary>14. Docs Search Pagination Not Working (fixed v0.98.3)</summary>

**Cause**: `nc docs search` returned all results with no pagination. Fixed by adding `--limit` and `--offset` flags. Default now shows first 20 results.
</details>
