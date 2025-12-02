---
sidebar_position: 6
title: Troubleshooting
description: Common issues and solutions
---

# Troubleshooting

## Ollama Connection Failed

```bash
# Ensure Ollama is running
ollama serve

# Check connection
curl http://localhost:11434/api/tags
```

## Command Not Found

```bash
# Check PATH
echo $PATH

# Add to PATH
export PATH=$PATH:/usr/local/bin
```

## Session Not Resuming

```bash
# Check session exists
nc session list

# Force refresh
nc session refresh
```

*More troubleshooting guides coming soon.*
