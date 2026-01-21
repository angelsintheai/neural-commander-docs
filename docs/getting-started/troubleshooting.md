---
sidebar_position: 6
title: Troubleshooting
description: Common issues and solutions
---

# Troubleshooting Guide

**Version**: v0.98.3

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

### 11. CLAUDE.md Alerts Not Updating

**Symptoms**: NC daemon running but CLAUDE.md alerts section stays stale (old timestamps)

**Version Fixed**: v0.98.3

**Cause**: The `HasNCDirectives()` check was too strict - it required both `NC-ALERTS-START` markers AND a specific protocol directive that was never installed.

**Check 1: Verify daemon is running with correct binary**
```bash
# Check daemon PID
pgrep -f neural-commander

# Verify it's using the latest binary
ls -la ~/.local/bin/nc
ls -la /path/to/dist/nc

# If different timestamps, copy the newer one
cp /path/to/dist/nc ~/.local/bin/nc
```

**Check 2: Verify CLAUDE.md has correct markers**
```bash
# Your CLAUDE.md needs these markers:
grep "NC-ALERTS-START" CLAUDE.md
grep "NC-ALERTS-END" CLAUDE.md

# Both should return results
```

**Check 3: Look for duplicate markers**
```bash
# Should return exactly 1 for each
grep -c "NC-ALERTS-START" CLAUDE.md
grep -c "NC-ALERTS-END" CLAUDE.md

# If more than 1, you have duplicate markers - edit manually to remove
```

**Fix**: Restart daemon with latest binary
```bash
pkill -f neural-commander
cp /path/to/new/nc ~/.local/bin/nc
nc daemon start
```

---

### 12. Session State Inconsistency (WSL2)

**Symptoms**: `nc claude-session list` shows different state than `nc claude-session show <id>`

**Version Fixed**: v0.98.3

**Cause**: On WSL2, file system caching can cause stale modification times. A session file might show "last modified 10 minutes ago" even though Claude Code is actively running.

**Check**: Verify process is actually running
```bash
# Look for Claude processes
ps aux | grep -E "claude|node.*claude"

# Check if process owns the session directory
ls -la ~/.claude/projects/
```

**How NC Fixes This (v0.98.3+)**:

NC now uses **hybrid state detection**:
1. First checks file modification time
2. If file appears stale (>5 min), checks if Claude process is actually running
3. If process running → marks as Active (overrides stale file time)
4. If no process → marks as Crashed

This ensures consistent state reporting across `list` and `show` commands.

---

### 13. Project Status Path Duplication

**Symptoms**: `nc project status` shows duplicated paths like `/mnt/c/dev/projects/project/project`

**Version Fixed**: v0.98.3

**Cause**: Path normalization was joining an already-complete path with the project name again.

**Verification**:
```bash
# Should show clean path without duplication
nc project status my-project
```

**If still seeing duplication**: Ensure you're running v0.98.3+ binary:
```bash
nc version
# Should show v0.98.3 or later
```

---

### 14. Docs Search Pagination Not Working

**Symptoms**: `nc docs search` returns all results, no way to limit or paginate

**Version Fixed**: v0.98.3

**Solution**: Use the new flags (v0.98.3+):
```bash
# Limit to 10 results
nc docs search "api" --limit 10

# Skip first 10, show next 10 (page 2)
nc docs search "api" --limit 10 --offset 10
```

**Default Behavior**:
- Without flags: Shows first 20 results
- `--limit N`: Maximum N results
- `--offset N`: Skip first N results

---

## WSL2-Specific Issues

### File System Caching

**Problem**: WSL2's file system layer can cache file metadata, causing:
- Stale modification times on session files
- Session state appearing "crashed" when actually active
- File changes not immediately visible

**Mitigation**: NC v0.98.3+ uses hybrid detection (file time + process check) to work around this.

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
