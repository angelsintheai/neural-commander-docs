---
sidebar_position: 7
title: Claude Code Integration
description: Using NC with Claude Code
---

# Claude Code Integration

NC integrates with Claude Code via the CLAUDE.md file.

## Active Alerts

NC daemon injects alerts into your CLAUDE.md:

```markdown
<!-- NC-ALERTS-START -->
### WARNING: Uncommitted Changes
100 modified files detected
<!-- NC-ALERTS-END -->
```

## Session Resume

```bash
nc session resume
```

*Full integration guide coming soon.*
