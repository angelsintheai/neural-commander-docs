---
sidebar_position: 2
title: Installation
description: Complete installation guide for all platforms
---

# Installation Guide

Neural Commander runs on Linux, macOS, and Windows. Choose your platform below.

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Storage | 500 MB | 2+ GB (for models) |
| Go | 1.21+ | 1.22+ |

## Prerequisites

### Ollama (Required for AI Features)

Neural Commander uses Ollama for local AI model inference.

```bash
# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# macOS
brew install ollama

# Windows
# Download from https://ollama.ai/download
```

After installing, pull a model:

```bash
ollama pull llama3.2:3b
ollama pull codellama:7b  # Recommended for code tasks
```

## Installation Methods

### Method 1: Pre-built Binaries (Recommended)

Download the latest release for your platform:

#### Linux (x64)

```bash
curl -L https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-linux -o nc
chmod +x nc
sudo mv ncmd /usr/local/bin/
```

#### Linux (ARM64)

```bash
curl -L https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-linux-arm64 -o nc
chmod +x nc
sudo mv ncmd /usr/local/bin/
```

#### macOS (Intel)

```bash
curl -L https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-mac-intel -o nc
chmod +x nc
sudo mv ncmd /usr/local/bin/
```

#### macOS (Apple Silicon)

```bash
curl -L https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander-mac-arm64 -o nc
chmod +x nc
sudo mv ncmd /usr/local/bin/
```

#### Windows

```powershell
# PowerShell
Invoke-WebRequest -Uri "https://github.com/angelsintheai/neural-commander/releases/latest/download/neural-commander.exe" -OutFile "$env:USERPROFILE\bin\nc.exe"
# Add to PATH or run directly
```

### Method 2: Build from Source

```bash
# Clone repository
git clone https://github.com/angelsintheai/neural-commander.git
cd neural-commander/neural-commander-go

# Build
go build -o ncmd ./cmd/nc

# Install (Linux/macOS)
sudo mv ncmd /usr/local/bin/

# Or add to PATH
export PATH=$PATH:$(pwd)
```

### Method 3: Go Install

```bash
go install github.com/angelsintheai/neural-commander/cmd/nc@latest
```

## Verify Installation

```bash
# Check version
ncmd version

# Expected output:
# Neural Commander v0.99 (Community Edition)
# Build: go1.22.0 linux/amd64

# Check health
ncmd health

# Expected output:
# Neural Commander Health Check
# ✓ Configuration: OK
# ✓ Ollama: Connected (16 models)
# ✓ Database: OK
# ✓ API Server: Ready
```

## Post-Installation Setup

### 1. Initialize Configuration

```bash
ncmd init
# Creates ~/.neural-commander/ directory with default config
```

### 2. Start the Daemon (Optional)

```bash
ncmd daemon start
# Starts background monitoring for projects
```

### 3. Configure Your First Project

```bash
cd /path/to/your/project
ncmd init --project
# Creates .nc/ directory with project-specific settings
```

## Updating

### Binary Installation

Download and replace the binary with the latest version.

### Source Installation

```bash
cd neural-commander
git pull
cd neural-commander-go
go build -o ncmd ./cmd/nc
sudo mv ncmd /usr/local/bin/
```

## Uninstalling

```bash
# Remove binary
sudo rm /usr/local/bin/nc

# Remove configuration (optional)
rm -rf ~/.neural-commander/

# Remove project configs (optional, per project)
rm -rf /path/to/project/.nc/
```

## Troubleshooting Installation

### "command not found"

Ensure the binary is in your PATH:

```bash
echo $PATH
# Add /usr/local/bin if missing
export PATH=$PATH:/usr/local/bin
```

### Permission Denied

```bash
chmod +x /usr/local/bin/nc
```

### Ollama Connection Failed

```bash
# Ensure Ollama is running
ollama serve

# Check connection
curl http://localhost:11434/api/tags
```

### Build Errors

Ensure you have Go 1.21+:

```bash
go version
# go version go1.22.0 linux/amd64
```

---

*See [Configuration](/docs/getting-started/configuration) for customizing Neural Commander.*
