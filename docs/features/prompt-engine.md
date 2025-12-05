---
sidebar_position: 8
title: Prompt Engine
description: Intelligent prompt enhancement
---

# Prompt Engine

The Prompt Engine enhances your prompts for better AI responses. It analyzes prompts, predicts effectiveness, suggests improvements, and recommends the best model for each task.

## How It Works

```
User Prompt
     │
     ▼
┌────────────────────────────────────────────┐
│         Prompt Engine Processing           │
│  ┌──────────────────────────────────────┐ │
│  │ 1. Generate embedding                 │ │
│  │ 2. Search similar prompts             │ │
│  │ 3. Predict effectiveness              │ │
│  │ 4. Suggest improvements               │ │
│  │ 5. Recommend model                    │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
     │
     ▼
Enhanced Prompt + Recommendations
     │
     ▼
Send to LLM (with improvements applied)
     │
     ▼
Feedback Loop → Improve Future Predictions
```

## Features

### Effectiveness Prediction

Before sending a prompt, the engine predicts how well it will perform:

```bash
nc prompt analyze "Write a function to validate email addresses"
```

**Output**:
```
Prompt Analysis
===============

Predicted Effectiveness: 85%
Suggested Model: gpt-4

Improvements:
  1. Specify the programming language
  2. Mention edge cases to handle (e.g., international domains)
  3. Indicate whether to use regex or a library

Similar Successful Prompts:
  - "Write a TypeScript email validator with RFC 5322 compliance" (92% effective)
  - "Create Python email validation using email-validator library" (89% effective)
```

### Model Recommendation

The engine suggests the best model based on:

- Task complexity
- Similar prompt history
- Response quality data

```bash
nc prompt recommend "Explain the theory of relativity to a 5-year-old"
```

**Output**:
```
Recommended Model: claude-3-opus
Reasoning: Creative explanations benefit from larger context and nuanced output
```

### Improvement Suggestions

Get specific suggestions to improve your prompts:

```bash
nc prompt improve "fix the bug"
```

**Output**:
```
Original: "fix the bug"

Suggestions:
  1. Specify which bug (file location, error message)
  2. Describe expected vs actual behavior
  3. Include relevant code context
  4. Mention what you've already tried

Improved Example:
  "Fix the NullPointerException in UserService.java line 42.
   Expected: User object returned when found in database.
   Actual: Null returned even when user exists.
   Already tried: Adding null check before database call."
```

### Historical Search

Find similar prompts that worked well:

```bash
nc prompt search "authentication"
```

**Output**:
```
Similar Prompts (by effectiveness):

1. "Implement JWT authentication with refresh tokens" - 94%
   Model: claude-3-sonnet | Response time: 2.1s

2. "Add OAuth2 login with Google provider" - 91%
   Model: gpt-4 | Response time: 3.4s

3. "Create session-based auth with Redis store" - 88%
   Model: claude-3-haiku | Response time: 1.2s
```

## Using the Prompt Engine

### With NC Chat

The Prompt Engine integrates automatically with `nc chat`:

```bash
# Engine enhances your prompt automatically
nc chat "Create a REST API endpoint"

# Skip enhancement
nc chat --raw "Create a REST API endpoint"
```

### With Context

Provide context for better recommendations:

```bash
nc chat "Add error handling" --context language=go --context project=api-server
```

### Feedback Loop

After receiving responses, NC can record effectiveness:

```bash
# Mark response as helpful
nc feedback good

# Mark response as unhelpful
nc feedback poor --reason "Code didn't compile"
```

This feedback improves future predictions.

## API Reference

### POST /api/prompt/analyze

Analyze a prompt without sending it.

```bash
curl -X POST http://localhost:7669/api/prompt/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Write a hello world function",
    "context": {
      "language": "python"
    }
  }'
```

**Response**:
```json
{
  "id": "prompt-abc123",
  "predictedEffectiveness": 0.75,
  "suggestedModel": "claude-3-haiku",
  "improvements": [
    "Specify if you want tests included",
    "Mention any specific style preferences"
  ],
  "similarPrompts": [
    {
      "text": "Create a Python hello world with docstring",
      "effectiveness": 0.92,
      "model": "claude-3-haiku"
    }
  ]
}
```

### POST /api/prompt/feedback

Submit feedback for training.

```bash
curl -X POST http://localhost:7669/api/prompt/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "promptId": "prompt-abc123",
    "effectiveness": 0.85,
    "modelUsed": "gpt-4",
    "responseQuality": "good",
    "userSatisfaction": true
  }'
```

### GET /api/prompt/similar

Find similar historical prompts.

```bash
curl "http://localhost:7669/api/prompt/similar?q=authentication&limit=5"
```

## Configuration

### Enable/Disable

```bash
# Enable prompt enhancement (default)
nc config set prompt_engine.enabled true

# Disable
nc config set prompt_engine.enabled false
```

### Sensitivity

Control how aggressive improvements are:

```bash
# Conservative (fewer suggestions)
nc config set prompt_engine.sensitivity low

# Balanced (default)
nc config set prompt_engine.sensitivity medium

# Aggressive (more suggestions)
nc config set prompt_engine.sensitivity high
```

### Model Preferences

Set default model preferences:

```bash
# Prefer speed
nc config set prompt_engine.preference speed

# Prefer quality
nc config set prompt_engine.preference quality

# Balance
nc config set prompt_engine.preference balanced
```

## Best Practices

### 1. Include Context

More context leads to better recommendations:

```bash
# Weak
nc chat "fix the error"

# Strong
nc chat "fix the error" --context file=server.go --context error="nil pointer"
```

### 2. Use Feedback

Training the engine improves accuracy:

```bash
# After each interaction
nc feedback good  # or poor
```

### 3. Review Improvements

Don't blindly accept suggestions - review them:

```bash
# Show suggestions but don't auto-apply
nc prompt analyze "my prompt" --no-auto-apply
```

### 4. Check History

Before crafting a prompt, check what worked before:

```bash
nc prompt search "similar task"
```

## Troubleshooting

### Low Effectiveness Predictions

If predictions are consistently low:

1. Add more context to your prompts
2. Check if the Prompt Engine has sufficient training data
3. Try `nc prompt improve` for specific suggestions

### Slow Response

The Prompt Engine adds latency for analysis:

```bash
# Skip analysis for simple prompts
nc chat --raw "hello"

# Check engine status
nc status --prompt-engine
```

### Bad Recommendations

If model recommendations seem wrong:

```bash
# Override the recommendation
nc chat "complex task" --model gpt-4

# Submit feedback
nc feedback poor --reason "Wrong model recommended"
```

---

*See [Learning System](/docs/features/learning-system) for how prompt effectiveness feeds into organizational learning.*
