---
sidebar_position: 4
title: First Project Scan
description: Run your first project audit with Neural Commander
---

# First Project Scan

This guide walks you through running your first project health audit.

## Quick Scan (Recommended for First Time)

The quickest way to see NC in action:

```bash
cd /path/to/your/project
ncmd audit --quick
```

This runs a fast scan (targeting &lt;30s) that skips heavy directories like `node_modules`, `.git`, and `vendor`.

### Sample Output

```
⚡ Quick Scan Mode (target: <30s)

🔍 Project Health Audit: my-project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵 Overall Health: B (82/100)

Category Breakdown:
  ✅ Documentation   A  90/100
  ✅ Requirements    B  85/100
  ✅ Code Quality    C  75/100
  ✅ Git Health      B  80/100

Findings: 8 total (🟡 2 medium)

Top Issues:
  1. [medium] 5 TODO comments found
  2. [medium] 3 stale documentation files

Duration: 2.4s

💡 Run with --format markdown for full report
```

## Save Report to File

To save the audit as a markdown report:

```bash
ncmd audit -o
```

This creates a file like `20260117-143022-my-project-audit.md` in the current directory.

### Save to Specific Location

```bash
# Save to reports directory
ncmd audit -o ./reports/

# Save with custom filename
ncmd audit -o my-project-health.md
```

## Full Scan

For a comprehensive analysis (takes longer):

```bash
ncmd audit
```

This performs a deeper scan with:
- Higher directory depth
- More thorough code analysis
- Full metrics collection

## Understanding the Results

NC analyzes four dimensions:

### 📝 Documentation Health
- CLAUDE.md presence
- Document freshness (stale = 90+ days)
- Metadata coverage
- Documentation sprawl

### 📋 Requirements Tracking
- REQ- file detection
- Implementation status
- Violation tracking
- Coverage percentage

### 💻 Code Quality
- TODO/FIXME/HACK comments
- Long functions (>100 lines)
- Large files
- Complexity score

### 🔀 Git Health
- Uncommitted changes
- Untracked files
- Days since last commit
- Unpushed commits

## Grades

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100 | Excellent health |
| B | 80-89 | Good health |
| C | 70-79 | Needs attention |
| D | 60-69 | Poor health |
| F | 0-59 | Critical issues |

## Next Steps

After your first scan:

1. **Review findings** - Check the Top Issues section
2. **Address critical items** - Fix any red/critical findings
3. **Set up regular scans** - Consider adding to CI/CD
4. **Monitor trends** - Run scans regularly to track improvement

---

*See [CLI Reference](/docs/getting-started/cli-reference) for all audit options.*
