---
sidebar_position: 1
title: Deployment
description: Deploying Neural Commander
---

# Production Deployment Guide

**Version**: v0.98.1

---

NC is a local-first tool that runs on your machine. This guide covers installation, service setup, and maintenance procedures.

---

## Pre-Deployment Checklist

- [ ] Downloaded correct binary for platform
- [ ] Verified SHA256 checksum
- [ ] Created `~/.nc/` directory structure
- [ ] Set required environment variables
- [ ] Configured firewall (if exposing API)
- [ ] Set up log rotation
- [ ] Tested basic functionality

---

## Installation

### Step 1: Download Binary

```bash
# Linux AMD64
curl -LO https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-linux-amd64
chmod +x neural-commander-linux-amd64

# Verify checksum
curl -LO https://github.com/angelsintheai/neural-commander/releases/latest/download/SHA256SUMS.txt
sha256sum -c SHA256SUMS.txt --ignore-missing
```

### Step 2: Install Binary

```bash
# User installation
mkdir -p ~/.local/bin
mv neural-commander-linux-amd64 ~/.local/bin/nc
chmod +x ~/.local/bin/nc

# System-wide installation (requires sudo)
sudo mv neural-commander-linux-amd64 /usr/local/bin/nc
sudo chmod +x /usr/local/bin/nc
```

### Step 3: Create Data Directory

```bash
mkdir -p ~/.nc/{data,logs,config}
```

### Step 4: Configure Environment

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH=$PATH:~/.local/bin

# Optional: Set API keys
export NC_GITHUB_TOKEN="your-github-token"
export NC_TELEGRAM_BOT_TOKEN="your-bot-token"
```

### Step 5: Verify Installation

```bash
nc version
nc daemon status
```

---

## Systemd Service Setup

### Create Service File

```bash
sudo tee /etc/systemd/system/nc-daemon.service << 'EOF'
[Unit]
Description=Neural Commander Daemon
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
ExecStart=/home/YOUR_USERNAME/.local/bin/nc daemon start --foreground
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

# Resource limits
MemoryMax=4G
CPUQuota=80%

# Environment
Environment="HOME=/home/YOUR_USERNAME"
Environment="NC_GITHUB_TOKEN="
Environment="NC_TELEGRAM_BOT_TOKEN="

[Install]
WantedBy=multi-user.target
EOF
```

### Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable nc-daemon
sudo systemctl start nc-daemon
sudo systemctl status nc-daemon
```

### View Logs

```bash
journalctl -u nc-daemon -f
```

---

## Configuration

### Config File Location

```
~/.nc/config/nc.toml
```

### Example Configuration

```toml
[daemon]
api_port = 7669
api_bind = "127.0.0.1"  # localhost only
log_level = "info"

[resources]
max_cpu_percent = 80
max_memory_mb = 4096
mode = "interactive"

[sessions]
watch_interval = "5s"
checkpoint_interval = "30s"
crash_detection = true

[alerts]
claude_md_injection = true
injection_interval = "30s"

[github]
enabled = false
# token from environment: NC_GITHUB_TOKEN
owner = "angelsintheai"
repo = "neural-commander"

[telegram]
enabled = false
# token from environment: NC_TELEGRAM_BOT_TOKEN
```

---

## Upgrade Procedure

### 1. Backup Current Version

```bash
cp ~/.local/bin/nc ~/.local/bin/nc.backup
cp -r ~/.nc ~/.nc.backup-$(date +%Y%m%d)
```

### 2. Download New Version

```bash
curl -LO https://github.com/angelsintheai/neural-commander/releases/download/vX.Y.Z/neural-commander-linux-amd64
```

### 3. Verify Checksum

```bash
curl -LO https://github.com/angelsintheai/neural-commander/releases/download/vX.Y.Z/SHA256SUMS.txt
sha256sum -c SHA256SUMS.txt --ignore-missing
```

### 4. Stop Service

```bash
sudo systemctl stop nc-daemon
```

### 5. Replace Binary

```bash
mv neural-commander-linux-amd64 ~/.local/bin/nc
chmod +x ~/.local/bin/nc
```

### 6. Start Service

```bash
sudo systemctl start nc-daemon
```

### 7. Verify

```bash
nc version  # Should show new version
nc daemon status
curl http://localhost:7669/health
```

### 8. Rollback (if needed)

```bash
sudo systemctl stop nc-daemon
cp ~/.local/bin/nc.backup ~/.local/bin/nc
sudo systemctl start nc-daemon
```

---

## Incident Response

### Daemon Not Responding

1. Check if process exists: `pgrep -f neural-commander`
2. Check logs: `journalctl -u nc-daemon --since "10 minutes ago"`
3. Check resources: `free -h && df -h ~/.nc/`
4. Restart: `sudo systemctl restart nc-daemon`

### High Resource Usage

1. Check current usage: `nc daemon stats`
2. Identify cause: `top -p $(pgrep -f neural-commander)`
3. Lower limits if needed: Edit `/etc/systemd/system/nc-daemon.service`
4. Restart with new limits: `sudo systemctl daemon-reload && sudo systemctl restart nc-daemon`

### API Errors

1. Check API health: `curl http://localhost:7669/api/health`
2. Check port binding: `netstat -tlnp | grep 7669`
3. Check logs for errors: `grep -i error ~/.nc/logs/api.log | tail -20`

---

## Maintenance Windows

### Daily

- Review error logs: `grep -i error ~/.nc/logs/*.log | tail -50`
- Check disk usage: `du -sh ~/.nc/`

### Weekly

- Rotate old checkpoints: `find ~/.nc/data/checkpoints -mtime +7 -delete`
- Review session crash reports: `nc claude-session list --crashed`

### Monthly

- Full backup: `tar -czf nc-backup-$(date +%Y%m).tar.gz ~/.nc/`
- Review and update configuration
- Check for NC updates

---

## Contacts

| Role | Contact |
|------|---------|
| Security issues | security@neuralcommander.ai |
| Bug reports | `nc feedback bug "description"` |
| Community | Telegram alpha group |
