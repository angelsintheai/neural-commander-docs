---
sidebar_position: 3
title: Monitoring
description: Monitoring Neural Commander
---

# Monitoring Guide

**Version**: v0.99.0-beta

---

## Overview

Neural Commander provides built-in monitoring through:
1. **Health endpoints** - HTTP health checks
2. **Daemon stats** - Resource usage metrics
3. **Logs** - Structured logging
4. **Admin console** - Real-time TUI dashboard

---

## Health Checks

### Basic Health

```bash
curl http://localhost:7669/health
# Returns: {"status":"ok","version":"v0.99.0-beta"}
```

### Detailed Health

```bash
curl http://localhost:7669/api/health
# Returns detailed component status
```

### Health Check Script

```bash
#!/bin/bash
# nc-healthcheck.sh - Use with monitoring systems

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:7669/health)

if [ "$RESPONSE" = "200" ]; then
    echo "OK"
    exit 0
else
    echo "CRITICAL - NC API not responding (HTTP $RESPONSE)"
    exit 2
fi
```

---

## Metrics

### Daemon Statistics

```bash
nc daemon stats
```

Output:
```
Neural Commander Daemon Statistics
──────────────────────────────────
Uptime:           4h 23m
Sessions Active:  3
Events Processed: 1,247
API Requests:     892
Cache Hit Rate:   78%
Memory Usage:     156 MB
CPU Usage:        2.3%
```

### API Metrics Endpoint

```bash
curl http://localhost:7669/api/status
```

Returns:
```json
{
  "daemon": {
    "uptime_seconds": 15780,
    "sessions_active": 3,
    "events_processed": 1247
  },
  "resources": {
    "cpu_percent": 2.3,
    "memory_mb": 156,
    "goroutines": 42
  },
  "api": {
    "requests_total": 892,
    "cache_hit_rate": 0.78
  }
}
```

---

## Log Monitoring

### Log Locations

| Component | File | Rotation |
|-----------|------|----------|
| Daemon | `~/.nc/logs/daemon.log` | 10MB, 7 days |
| API | `~/.nc/logs/api.log` | 10MB, 7 days |
| Sessions | `~/.nc/logs/sessions.log` | 10MB, 7 days |
| Errors | `~/.nc/logs/error.log` | 10MB, 30 days |

### Log Format

```
2026-01-16T13:45:23Z INFO [daemon] Session watcher started
2026-01-16T13:45:24Z DEBUG [api] GET /api/status 200 12ms
2026-01-16T13:45:30Z WARN [sessions] Session abc123 idle for 30m
2026-01-16T13:46:01Z ERROR [ollama] Connection refused
```

### Log Aggregation

**With journald (systemd)**:
```bash
journalctl -u nc-daemon -f
```

**With Loki/Promtail**:
```yaml
# promtail config
scrape_configs:
  - job_name: neural-commander
    static_configs:
      - targets:
          - localhost
        labels:
          job: nc
          __path__: /home/*/.nc/logs/*.log
```

---

## Alerting

### Built-in Alerts

NC has a built-in alert system that injects warnings into CLAUDE.md:

| Alert | Trigger | Severity |
|-------|---------|----------|
| Uncommitted code | >10 files modified | WARNING |
| Long session | >4 hours continuous | INFO |
| High memory | >80% of limit | WARNING |
| Session crash | Exit code != 0 | CRITICAL |

### External Alerting

**Prometheus Alert Rules**:
```yaml
groups:
  - name: neural-commander
    rules:
      - alert: NCDaemonDown
        expr: up{job="nc"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "NC Daemon is down"

      - alert: NCHighMemory
        expr: nc_memory_usage_mb > 3000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "NC using >3GB memory"
```

**Simple Cron Check**:
```bash
# /etc/cron.d/nc-monitor
*/5 * * * * user curl -sf http://localhost:7669/health || echo "NC down" | mail -s "NC Alert" admin@example.com
```

---

## Admin Console Dashboard

```bash
nc admin
```

Provides real-time views:
- **Overview**: System status, resource usage
- **Events**: Live event stream
- **Sessions**: Active Claude sessions
- **Intelligence**: Pattern detection status

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Switch views |
| `q` | Quit |
| `r` | Refresh |
| `?` | Help |

---

## Resource Monitoring

### Resource Governor Status

```bash
nc daemon status
```

Shows:
```
Resource Governor: ACTIVE
  Mode: interactive
  CPU Limit: 80%
  Memory Limit: 4096 MB
  Current CPU: 2.3%
  Current Memory: 156 MB
```

### Per-Process Metrics

```bash
# Using top
top -p $(pgrep -f neural-commander)

# Using htop
htop -p $(pgrep -f neural-commander)

# Using ps
ps -o pid,ppid,cmd,%cpu,%mem -p $(pgrep -f neural-commander)
```

---

## Integration with Monitoring Systems

### Prometheus

Metrics endpoint (Pro tier):
```
GET /api/metrics
```

Returns Prometheus-format metrics:
```
# HELP nc_daemon_uptime_seconds Daemon uptime in seconds
# TYPE nc_daemon_uptime_seconds gauge
nc_daemon_uptime_seconds 15780

# HELP nc_sessions_active Number of active sessions
# TYPE nc_sessions_active gauge
nc_sessions_active 3
```

### Grafana Dashboard

Import dashboard ID: `NC-001` (available in Pro tier)

Panels:
- Daemon uptime
- Session count over time
- API request rate
- Cache hit ratio
- Resource usage (CPU/Memory)

### Datadog

```yaml
# datadog.yaml
logs:
  - type: file
    path: /home/*/.nc/logs/*.log
    service: neural-commander
    source: go
```

---

## Performance Baselines

### Normal Operation

| Metric | Expected Range |
|--------|---------------|
| CPU | 1-5% idle, 10-30% active |
| Memory | 100-300 MB |
| API Latency | &lt;50ms (p99) |
| Cache Hit Rate | >70% |

### Warning Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU | >50% | >80% |
| Memory | >2GB | >3.5GB |
| API Latency | >200ms | >1000ms |
| Error Rate | >1% | >5% |
