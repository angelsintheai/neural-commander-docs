---
sidebar_position: 3
title: Building
description: Build from source
---

# Building from Source

```bash
# Linux
go build -o dist/nc ./cmd/nc

# Windows
GOOS=windows go build -o dist/nc.exe ./cmd/nc

# macOS
GOOS=darwin go build -o dist/nc-mac ./cmd/nc
```

*Full build guide coming soon.*
