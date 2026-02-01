---
sidebar_position: 2
title: Security
description: Neural Commander Security Model
---

# Security Model

**Version**: v0.99.0-beta

---

## Executive Summary

Neural Commander is designed with **local-first security** as a core principle. All data processing happens on-device by default, with cloud features requiring explicit opt-in.

---

## Security Principles

### Local-First Architecture

| Principle | Implementation |
|-----------|----------------|
| **Data sovereignty** | All data stored locally in `~/.nc/` |
| **Zero telemetry** | No usage data sent without consent |
| **Offline capable** | Core features work without network |
| **BYOK (Bring Your Own Key)** | User provides API keys for cloud services |

### Defense in Depth

```
┌─────────────────────────────────────────────┐
│           User Environment                  │
│  ┌───────────────────────────────────────┐  │
│  │         NC Process Sandbox            │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │      Resource Governor          │  │  │
│  │  │  (CPU/Memory limits enforced)   │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Data Classification

### Sensitive Data Locations

| Data Type | Location | Protection |
|-----------|----------|------------|
| API keys | Environment variables | Never stored on disk |
| Session data | `~/.nc/data/sessions/` | Local filesystem permissions |
| Feedback | `~/.nc/data/feedback.db` | SQLite with local access only |
| Learnings | `~/.nc/data/learnings/` | Project-scoped, local only |
| Logs | `~/.nc/logs/` | Rotated, local only |

### What We Never Store

- API keys or tokens (environment variables only)
- Source code content (only metadata/patterns)
- Personal identifiable information (unless explicitly provided)
- Telemetry or usage analytics

---

## Authentication & Authorization

### API Server (Port 7669)

| Endpoint Type | Auth Required | Notes |
|---------------|---------------|-------|
| `/health` | None | Health check only |
| `/api/*` | Optional API key | Configurable via `NC_API_KEY` |
| Tier-gated | Tier middleware | Pro/Enterprise features check license |

### GitHub Integration

- Uses `NC_GITHUB_TOKEN` environment variable
- Personal Access Token with minimal scopes (issues only)
- Never stored - passed at runtime

### Telegram Bot

- Uses `NC_TELEGRAM_BOT_TOKEN` environment variable
- Bot runs in group mode only
- Admin verification for sensitive commands

---

## Network Security

### Outbound Connections

| Service | Purpose | When Used |
|---------|---------|-----------|
| Ollama (`localhost:11434`) | Local LLM | Always (if configured) |
| Anthropic API | Cloud LLM | Only if API key provided |
| OpenAI API | Cloud LLM | Only if API key provided |
| GitHub API | Issue creation | Only with `--github` flag |
| Telegram API | Bot notifications | Only if bot configured |

### No Inbound Exposure

- API server binds to `localhost:7669` by default
- No publicly routable endpoints in Community Edition
- Firewall not required for basic operation

---

## Resource Safety

### Resource Governor

NC includes a Resource Governor that prevents runaway resource consumption:

```go
// Default limits (configurable)
MaxCPUPercent:  80%   // Never exceed 80% CPU
MaxMemoryMB:    4096  // 4GB memory cap
Mode:           "interactive"  // Balanced performance
```

### Platform-Specific Safety

| Platform | Safety Measures |
|----------|----------------|
| **Windows** | Process priority management, memory limits |
| **Linux** | cgroups-compatible, signal handling |
| **macOS** | Memory pressure handling, thermal awareness |

---

## Threat Model

### In Scope

| Threat | Mitigation |
|--------|------------|
| Local file tampering | Filesystem permissions, checksums |
| Resource exhaustion | Resource Governor limits |
| API key exposure | Environment variables, never logged |
| Malicious plugins | Plugin signing (future), sandboxing |

### Out of Scope (User Responsibility)

- Physical access to machine
- Compromised operating system
- Network-level attacks (firewall your own machine)
- Malicious Ollama models (user chooses models)

---

## Compliance Considerations

### GDPR/CCPA

- **Data minimization**: Only collect what's needed
- **Local processing**: Data stays on user's machine
- **No tracking**: Zero telemetry by default
- **Right to deletion**: All data in `~/.nc/`, user can delete

### SOC2 (Enterprise)

Enterprise tier includes:
- Audit logging
- Access controls
- Data residency options
- SSO/SAML integration

---

## Security Best Practices

### For Users

1. **Keep NC updated** - Security fixes in each release
2. **Use environment variables for secrets** - Never hardcode API keys
3. **Review plugin sources** - Only install trusted plugins
4. **Backup `~/.nc/`** - Your data, your responsibility

### For Contributors

1. **Never log secrets** - API keys, tokens must not appear in logs
2. **Validate all input** - Especially from API endpoints
3. **Use parameterized queries** - SQLite operations use prepared statements
4. **Follow least privilege** - Request minimal API scopes

---

## Vulnerability Reporting

**Security issues**: Report privately to security@neuralcommander.ai

**Do not**:
- Open public GitHub issues for security vulnerabilities
- Share exploit details before fix is released

**We will**:
- Acknowledge within 48 hours
- Provide fix timeline within 7 days
- Credit reporters (unless anonymity requested)

---

## Security Roadmap

### v0.99 (Current)

- [ ] Plugin signature verification
- [ ] Encrypted local storage option
- [ ] API key rotation reminders

### v1.0 (Planned)

- [ ] Audit logging for all operations
- [ ] Role-based access control (Enterprise)
- [ ] Hardware security key support
