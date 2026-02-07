---
sidebar_position: 6
title: Resource Governor
description: CPU and memory management
---

# Resource Governor

The Resource Governor is NC's safety system that prevents it from overwhelming your computer. It automatically manages CPU usage, memory, concurrent tasks, and provides emergency protection.

**Promise**: NC will NEVER lock up your system.

## How It Works

```
Your Computer's Resources
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│   │   CPU    │  │  Memory  │  │   Disk   │                    │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘                    │
│        │             │              │                          │
│        └─────────────┼──────────────┘                          │
│                      │                                          │
│              ┌───────┴───────┐                                  │
│              │    Resource   │                                  │
│              │    Governor   │◄────── Monitoring Loop           │
│              │               │        (every 5 seconds)         │
│              └───────┬───────┘                                  │
│                      │                                          │
│        ┌─────────────┼─────────────┐                           │
│        ▼             ▼             ▼                           │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                       │
│   │ Session │  │ Pattern │  │ Alert   │  ...other NC tasks    │
│   │ Monitor │  │ Extract │  │ System  │                       │
│   └─────────┘  └─────────┘  └─────────┘                       │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Protection Levels

### Level 1: Normal Operation

Everything running smoothly.

```
Status: ✅ NORMAL
CPU: 45%  (limit: 80%)
Memory: 12GB / 48GB
Goroutines: 25 / 100
```

### Level 2: Limit Warnings

Getting close to limits.

```
Status: ⚠️ WARNING
CPU: 75%  (limit: 80%)
Memory: 35GB / 48GB
Goroutines: 85 / 100

Action: NC slows down non-critical tasks
```

### Level 3: Thermal Throttle

System under significant load.

```
Status: 🔶 THERMAL THROTTLE
CPU: 85%  → Limit reduced to 50%
Memory: Normal
Goroutines: 50 → Limit reduced to 50

Duration: Auto-releases after 30 seconds
```

### Level 4: Emergency Mode

Critical protection activated.

```
Status: 🔴 EMERGENCY MODE
CPU: Limited to 25%
Memory: Limited to 25% of normal
Goroutines: Maximum 10

Action: Aggressive garbage collection
Duration: Auto-releases after 60 seconds
```

## Checking Status

### View Current Status

```bash
# Full resource status
ncmd status

# Just governor status
ncmd status --governor
```

**Example Output**:
```
Neural Commander Status
=======================

Resource Governor: ✅ NORMAL

RESOURCE      CURRENT    LIMIT      STATUS
CPU           42%        80%        ✅
Memory        8.2 GB     36 GB      ✅
Goroutines    18         100        ✅

Circuit Breakers:
  CPU:        CLOSED (healthy)
  Memory:     CLOSED (healthy)
  Goroutine:  CLOSED (healthy)

Protection Modes:
  Thermal Throttle: OFF
  Emergency Mode:   OFF

Last check: 2 seconds ago
```

### API Access

```bash
curl http://localhost:7669/api/status | jq '.governor'
```

## Circuit Breakers

Circuit breakers prevent cascading failures:

```
┌─────────────────────────────────────────────────────────────┐
│                    Circuit Breaker States                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   CLOSED              OPEN                HALF-OPEN         │
│   (Normal)            (Protecting)        (Testing)         │
│                                                              │
│   Operations     →    Failures trigger → After timeout,     │
│   work normally       protection          test one request  │
│                       All requests        If success → CLOSED│
│                       fast-fail           If fail → OPEN     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Circuit Breaker Settings**:

| Breaker | Opens After | Resets After |
|---------|-------------|--------------|
| CPU | 5 failures | 30 seconds |
| Memory | 3 failures | 60 seconds |
| Goroutine | 10 failures | 10 seconds |

## When Protections Activate

### Thermal Throttle Triggers

- GPU temperature > 83°C
- System CPU available < 20% with sustained load

**What Happens**:
- CPU limit reduced to 50%
- Goroutine limit halved
- Non-critical tasks paused
- Auto-releases after 30 seconds

### Emergency Mode Triggers

- CPU available < 20%
- Available RAM < 4GB (reserved for OS)
- Critical system resource exhaustion

**What Happens**:
- All limits reduced to minimum
- Aggressive garbage collection
- Only essential tasks run
- Auto-releases after 60 seconds

## Operating Modes

NC adapts resource usage based on your current workload:

```bash
# Light background work
ncmd resources mode background

# Normal interactive use (default)
ncmd resources mode interactive

# Heavy batch operations
ncmd resources mode intensive
```

| Mode | CPU Limit | RAM Limit | GPU Limit | Use Case |
|------|-----------|-----------|-----------|----------|
| Background | 25% | 10% of total | 30% | Daemon monitoring |
| Interactive | 50% | 25% of total | 60% | Normal use (default) |
| Intensive | 80% | 75% of total | 90% | Batch processing |

Even in intensive mode, safety reserves remain: 2 CPU cores and 4GB RAM always reserved for the OS.

## GPU Monitoring

NC auto-detects and monitors GPUs:

| Vendor | Metrics | Support |
|--------|---------|---------|
| **NVIDIA** | Utilization, memory, temp, power, fan | Full (via nvidia-smi) |
| **AMD** | Temp, utilization, memory | Basic (via rocm-smi) |
| **Intel** | Model, memory | Minimal |

```bash
ncmd resources gpu
```

When GPU temperature exceeds 83°C, thermal throttling activates automatically.

No GPU? No problem - GPU monitoring is optional. All other safety features work without it.

## Platform Safety

### Windows

NC adds extra protection on Windows:
- **Process Priority**: Set to BELOW_NORMAL so your apps stay responsive
- **Job Objects**: OS-level containment kills NC if it exceeds memory limits
- **CPU Affinity**: Restricts NC to specific CPU cores
- **Desktop Monitor**: Checks if Windows desktop remains responsive

### WSL2

When running on WSL2 with `/mnt/c/` paths, file I/O is 5-10x slower. NC detects this and suggests alternatives.

### Linux / macOS

Standard GOMAXPROCS limiting (75% of cores, minimum 2).

## Session Resource Tracking

NC tracks resource usage per Claude Code session:

```bash
ncmd resources sessions
```

Tracked metrics: tokens used, API calls, memory usage, files read/written, estimated cost.

Default limits per session: 500K tokens, $1.00 estimated cost, 24-hour duration, 1,000 API calls.

## Configuration

### View Settings

```bash
ncmd config get governor
```

### Adjust Limits (Advanced)

Most users should use defaults. For advanced use:

```bash
# Increase goroutine limit (be careful!)
ncmd config set governor.max_goroutines 150

# Adjust CPU threshold
ncmd config set governor.max_cpu_percent 70

# Reset to defaults
ncmd config reset governor
```

**Default Values**:

| Setting | Linux/Mac | Windows |
|---------|-----------|---------|
| Max Goroutines | 100 | 50 |
| Max CPU % | 80 | 80 |
| Max Memory % | 75 | 75 |

## Troubleshooting

### NC Seems Slow

1. **Check status**:
   ```bash
   ncmd status --governor
   ```

2. **Look for throttling**:
   ```
   Thermal Throttle: ON  ← This slows things down
   ```

3. **Wait or restart**:
   - Throttle releases after 30 seconds
   - Or restart NC: `ncmd daemon restart`

### "Cannot Launch Task" Error

This means you've hit a limit:

```bash
# Check current goroutines
ncmd status --governor

# Output shows:
# Goroutines: 100/100  ← At limit!
```

**Solutions**:
1. Wait for tasks to complete
2. Reduce concurrent operations
3. Check for runaway tasks

### Emergency Mode Activated

```
🔴 NC is in EMERGENCY MODE
```

**What to do**:
1. NC will auto-recover in 60 seconds
2. Close memory-heavy applications
3. Check for memory leaks: `ncmd debug memory`

### Circuit Breaker Open

```
Circuit Breaker: CPU = OPEN
```

**Meaning**: Too many CPU limit violations. NC is protecting your system.

**Solutions**:
1. Wait 30 seconds for auto-reset
2. Check what's consuming CPU
3. Reduce NC's workload

## Best Practices

### 1. Let It Run

The governor is designed to "just work". Don't disable protections.

### 2. Monitor During Heavy Work

When doing large scans or intensive operations:
```bash
# In another terminal
watch ncmd status --governor
```

### 3. Don't Increase Limits Without Reason

The defaults are conservative for safety. Only increase if you:
- Have a powerful system AND
- Understand the risks AND
- Are monitoring resource usage

### 4. Report Issues

If NC triggers emergency mode frequently, that's a bug:
```bash
ncmd report --include-governor-logs
```

## Common Questions

### Q: Will NC slow down my other applications?

**A**: No. The governor ensures NC uses at most 80% CPU (usually much less). Your other apps always have resources.

### Q: Why is the Windows goroutine limit lower?

**A**: Windows handles concurrent tasks differently. The lower limit (50 vs 100) prevents system instability.

### Q: Can I disable the governor?

**A**: No, and you shouldn't want to. It's a core safety feature that prevents system lockups.

### Q: How do I know if the governor is working?

**A**: Run `ncmd status --governor`. If you see "NORMAL" status, it's working. You can also check logs:
```bash
grep governor ~/.neural-commander/daemon.log
```

---

*The Resource Governor integrates with [Active Alerts](/docs/features/active-alerts) for resource warnings and [Admin Console](/docs/features/admin-console) for real-time resource display.*
