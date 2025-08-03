# Contributing to GamaEdtech

Thank you for contributing to GamaEdtech! We appreciate your efforts to improve the project. Please follow the guidelines below to ensure a smooth contribution process.

## Table of Contents
1. [Commit Message Conventions](#commit-message-conventions)
2. [Branch Naming Conventions](#branch-naming-conventions)
3. [Pull Request Standards](#pull-request-standards)

## Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. Following this format helps us to generate changelogs and automate versioning.

### Format:

- **type**: The type of change you are committing (e.g., feat, fix, docs, chore, style, refactor, test).
- **scope**: Optional. A scope or component affected (e.g., api, ui, config).
- **subject**: A short description of the change, written in the imperative mood (e.g., "Add new feature").

### Examples:
- `feat(auth): add JWT authentication`
- `fix(ui): resolve button alignment issue`
- `docs(readme): update project setup instructions`

### Types:
- **feat**: A new feature or enhancement
- **fix**: A bug fix
- **docs**: Documentation changes
- **chore**: Routine tasks like refactoring, dependency updates, etc.
- **style**: Code style changes (e.g., formatting, missing semicolons)
- **refactor**: Code changes that neither fix a bug nor add a feature but improve readability or performance
- **test**: Adding or fixing tests



## Branch Naming Conventions

Branches should be named in a way that clearly indicates the purpose of the branch.

### Format:

- **type**: The type of the branch (e.g., feat, fix, docs, chore).
- **issue-or-task-id**: The ID of the issue or task being worked on (optional but helpful if you are using an issue tracker).
- **short-description**: A short description of what the branch is working on.

### Examples:
- `feat/123-add-login-page`
- `fix/456-correct-header-alignment`
- `docs/789-update-readme`
- `chore/101-cleanup-unused-files`

### Branch Type Key:
- **feat**: New features or functionality
- **fix**: Bug fixes
- **docs**: Documentation updates
- **chore**: Other tasks such as refactoring, configuration, or testing

## Pull Request Standards

All pull requests must follow these standards to maintain consistency and enable automated processes.

### Pull Request Title Format

PR titles **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) format, similar to commit messages:

```
<type>[optional scope]: <description>
```

#### Examples:
- `feat(auth): add JWT authentication system`
- `fix(ui): resolve button alignment issue on mobile`
- `docs: update API documentation`
- `chore(deps): update dependencies to latest versions`

#### Rules:
- **Type**: Must be one of: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `test`
- **Scope**: Optional but recommended (e.g., component, module, or area affected)
- **Description**: Should be clear, concise, and written in imperative mood
- **Case**: Description should start with lowercase letter
- **Length**: Keep title under 72 characters

### Pull Request Body Requirements

The PR body should provide clear context and information:

#### Required Content:
- **What**: Clear description of changes made
- **Why**: Explanation of why these changes were necessary
- **How**: Brief overview of the approach taken (if complex)
- **Testing**: Information about testing performed

#### Example PR Body:
```markdown
## What
Add JWT authentication system to secure API endpoints.

## Why
Current authentication system is outdated and has security vulnerabilities.
Need to implement modern token-based authentication.

## How
- Implemented JWT token generation and validation
- Added middleware for protected routes
- Updated user login/logout flows

## Testing
- Added unit tests for JWT utilities
- Tested login/logout flows manually
- Verified token expiration handling
```

#### Quality Standards:
- Minimum 10 characters (automated check)
- No spelling errors or typos
- Clear and descriptive language
- Proper grammar and formatting
- Include relevant issue references if applicable

### Automated Validation

All PRs are automatically validated for:
- ✅ Title format compliance
- ✅ Body content quality
- ✅ Proper spelling and grammar

PRs that don't meet these standards will be **blocked** until corrected.

### Tips for Success:
- Review the [Conventional Commits specification](https://www.conventionalcommits.org/)
- Use clear, descriptive language
- Proofread your PR title and body before submitting
- Reference related issues using `#issue-number`
- Keep changes focused and atomic
