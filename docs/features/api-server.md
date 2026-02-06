---
sidebar_position: 7
title: API Server
description: Neural Commander REST API reference
---

# API Server

Neural Commander includes a built-in REST API server for integration with external tools, scripts, and applications.

## Quick Start

:::info Version 0.99 Update
As of v0.99, the REST API server is integrated into `nc daemon`. The daemon now starts both:
- **REST API** on port **7669** - For analytics, webhooks, sessions, chat
- **MCP Server** on port **7671** - For Claude Code integration
:::

```bash
# Start unified daemon (recommended)
nc daemon

# To disable REST API and only run MCP server:
nc daemon --no-api
```

The REST API runs on `http://localhost:7669` by default.

## API Endpoints

### Health Check

**GET /health**

Quick health check for monitoring.

```bash
curl http://localhost:7669/health
```

```json
{
  "status": "ok",
  "version": "0.99",
  "service": "neural-commander-api"
}
```

### Server Status

**GET /api/status**

Detailed server status including models and sessions.

```bash
curl http://localhost:7669/api/status
```

```json
{
  "status": "ok",
  "version": "0.99",
  "service": "neural-commander-api",
  "edition": "Community",
  "ollama_models": 16,
  "sessions": 17,
  "active_session": "bd5adee7-e606-4cc7-ba18-266dace8aad6",
  "endpoints": [
    "/health",
    "/api/status",
    "/api/chat",
    "/api/sessions",
    "/api/models"
  ]
}
```

### Chat (AI Generation)

**POST /api/chat**

Send a prompt and receive an AI-generated response with intelligent model routing.

```bash
curl -X POST http://localhost:7669/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a Python function to calculate fibonacci numbers"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Your question or task |
| `model` | string | No | Override model selection |
| `temperature` | float | No | Creativity (0.0-1.0, default 0.7) |
| `max_tokens` | int | No | Maximum response length |
| `session_id` | string | No | Continue existing session |

**Response:**

```json
{
  "success": true,
  "response": "Here's a Python function to calculate fibonacci...",
  "model_used": "codellama:7b",
  "routing": "Code generation task detected",
  "temperature": 0.3
}
```

**Smart Routing:**

NC automatically selects the best model based on your prompt:
- Code tasks → `codellama`
- General questions → `llama3.2`
- Creative writing → Higher temperature
- Technical docs → Lower temperature

### Sessions

**GET /api/sessions**

List all sessions.

```bash
curl http://localhost:7669/api/sessions
```

```json
{
  "success": true,
  "count": 17,
  "sessions": [
    {
      "id": "bd5adee7-e606-4cc7-ba18-266dace8aad6",
      "short_id": "bd5adee7",
      "project": "my-project",
      "created_at": "2025-10-10T14:33:08Z",
      "message_count": 42,
      "token_count": 12500
    }
  ]
}
```

**GET /api/sessions/active**

Get the currently active session.

```bash
curl http://localhost:7669/api/sessions/active
```

**POST /api/sessions**

Create a new session.

```bash
curl -X POST http://localhost:7669/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"project": "my-new-project"}'
```

### Models

**GET /api/models**

List available Ollama models.

```bash
curl http://localhost:7669/api/models
```

```json
{
  "success": true,
  "count": 16,
  "models": [
    {
      "name": "codellama:7b",
      "base_name": "codellama",
      "tag": "7b",
      "size": 3800000000
    },
    {
      "name": "llama3.2:3b",
      "base_name": "llama3.2",
      "tag": "3b",
      "size": 2000000000
    }
  ]
}
```

## Integration Examples

### Python

```python
import requests

NC_API = 'http://localhost:7669'

def chat(prompt, model=None):
    response = requests.post(f'{NC_API}/api/chat', json={
        'prompt': prompt,
        'model': model
    })
    return response.json()

# Usage
result = chat('Write a Python function to reverse a string')
print(f"Model: {result['model_used']}")
print(f"Response: {result['response']}")
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

const NC_API = 'http://localhost:7669';

async function chat(prompt) {
    const response = await axios.post(`${NC_API}/api/chat`, { prompt });
    return response.data;
}

// Usage
chat('Explain async/await in JavaScript').then(result => {
    console.log('Model:', result.model_used);
    console.log('Response:', result.response);
});
```

### Shell Script

```bash
#!/bin/bash

# Create session
SESSION_ID=$(curl -sX POST http://localhost:7669/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"project": "shell-project"}' | jq -r '.session_id')

# Chat with session context
curl -X POST http://localhost:7669/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"$1\", \"session_id\": \"$SESSION_ID\"}"
```

## CORS Support

The API server includes CORS headers for browser-based applications:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Error Handling

**Error Response Format:**

```json
{
  "error": "Error description",
  "status": 400
}
```

**HTTP Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid JSON, missing fields) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 500 | Internal Server Error |

## Performance

**Typical Response Times:**

| Endpoint | Time |
|----------|------|
| Health check | Under 10ms |
| Status | Under 100ms |
| Chat (simple) | 2-10 seconds |
| Chat (code) | 5-30 seconds |
| Sessions/Models | Under 50ms |

## Security

**Current Version:**
- Server binds to `localhost` only
- No authentication required (local use)
- CORS enabled for desktop integration

**Production Recommendations:**
1. Add API key authentication
2. Implement rate limiting
3. Set request size limits
4. Enable HTTPS/TLS
5. Restrict CORS origins

---

*See [Session Intelligence](/docs/features/session-intelligence) for understanding how NC manages conversation context.*
