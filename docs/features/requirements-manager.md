---
sidebar_position: 2
title: Requirements Manager
description: Track and manage project requirements with AI assistance
---

# Requirements Manager

The Requirements Manager helps you define, track, and validate project requirements using YAML files and AI-assisted analysis.

## Overview

NC's Requirements Manager:
- **Defines requirements** in structured YAML format
- **Tracks status** from proposed to completed
- **Validates implementation** against specifications
- **Generates reports** on requirement coverage

## Quick Start

### 1. Initialize Requirements

```bash
cd /path/to/project
nc requirements init
```

This creates `.nc/requirements/` with a template structure.

### 2. Create a Requirement

Create `.nc/requirements/req-auth-001.yaml`:

```yaml
id: REQ-AUTH-001
title: User Authentication
category: security
priority: high
status: proposed

description: |
  Users must be able to authenticate using email/password
  or OAuth providers (Google, GitHub).

acceptance_criteria:
  - Email/password login with validation
  - OAuth integration for Google and GitHub
  - Session management with JWT tokens
  - Password reset via email

dependencies:
  - REQ-DB-001  # Database schema

assignee: developer@example.com
target_version: v1.0.0
```

### 3. List Requirements

```bash
nc requirements list

# Output:
# ID           TITLE                STATUS    PRIORITY
# REQ-AUTH-001 User Authentication  proposed  high
# REQ-DB-001   Database Schema      complete  high
# REQ-API-001  REST API Design      in_progress medium
```

### 4. Validate Implementation

```bash
nc requirements validate REQ-AUTH-001

# Checks if code matches acceptance criteria
```

## Requirement Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (REQ-XXX-NNN) |
| `title` | string | Short descriptive title |
| `status` | enum | proposed, approved, in_progress, complete, deprecated |
| `priority` | enum | critical, high, medium, low |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `category` | string | Feature area (auth, api, ui, etc.) |
| `description` | string | Detailed description |
| `acceptance_criteria` | list | Specific criteria for completion |
| `dependencies` | list | Other requirement IDs |
| `assignee` | string | Responsible person |
| `target_version` | string | Target release version |
| `created_at` | date | Creation date |
| `updated_at` | date | Last modification |

## Status Workflow

```
proposed → approved → in_progress → complete
                ↓
           deprecated
```

## Commands

### List All Requirements

```bash
nc requirements list
nc requirements list --status in_progress
nc requirements list --priority high
nc requirements list --category auth
```

### Show Requirement Details

```bash
nc requirements show REQ-AUTH-001
```

### Update Status

```bash
nc requirements status REQ-AUTH-001 in_progress
nc requirements status REQ-AUTH-001 complete
```

### Generate Report

```bash
nc requirements report
nc requirements report --format markdown > requirements.md
```

### Validate Against Code

```bash
# Validate single requirement
nc requirements validate REQ-AUTH-001

# Validate all requirements
nc requirements validate --all
```

## AI-Assisted Features

### Generate Requirements from Description

```bash
nc requirements generate "Add user authentication with OAuth"
```

NC uses AI to:
- Suggest requirement structure
- Identify acceptance criteria
- Detect dependencies
- Estimate complexity

### Check Implementation Coverage

```bash
nc requirements coverage
```

Analyzes codebase to determine:
- Which requirements have matching implementations
- Code files related to each requirement
- Test coverage for requirements

## Directory Structure

```
.nc/
└── requirements/
    ├── req-auth-001.yaml
    ├── req-auth-002.yaml
    ├── req-api-001.yaml
    └── categories/
        ├── auth.yaml     # Category metadata
        └── api.yaml
```

## Integration with Sessions

Requirements integrate with NC sessions:

```bash
# Start session focused on a requirement
nc session new --requirement REQ-AUTH-001

# Context includes requirement details
nc chat "How should I implement this?"
```

The AI receives requirement context automatically.

## Best Practices

### 1. Use Consistent IDs

```
REQ-AUTH-001   # Authentication feature 1
REQ-AUTH-002   # Authentication feature 2
REQ-API-001    # API feature 1
```

### 2. Keep Acceptance Criteria Specific

```yaml
# Good
acceptance_criteria:
  - Password must be at least 8 characters
  - Must include one uppercase letter
  - Must include one number

# Avoid
acceptance_criteria:
  - Strong password validation
```

### 3. Track Dependencies

```yaml
dependencies:
  - REQ-DB-001   # Needs database
  - REQ-AUTH-001 # Needs authentication
```

### 4. Regular Status Updates

Update status as work progresses to maintain accurate project tracking.

## API Reference

### GET /api/requirements

List all requirements.

### GET /api/requirements/:id

Get requirement details.

### PUT /api/requirements/:id

Update requirement.

### POST /api/requirements/validate/:id

Validate requirement against code.

---

*See [Architecture Overview](/docs/architecture/overview) for how requirements integrate with the system.*
