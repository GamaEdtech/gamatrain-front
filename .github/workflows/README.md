# GitHub Actions Workflows

This directory contains automated workflows for the GamaEdtech project.

## pr-validation.yml

**Purpose**: Validates pull request titles and bodies to ensure they follow project standards.

**Triggers**: 
- When a PR is opened
- When a PR title or body is edited
- When new commits are pushed to a PR

**Validation Rules**:

### Title Validation
- Must follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Allowed types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `test`
- Subject should start with lowercase letter
- Should be written in imperative mood

### Body Validation  
- Must contain at least 20 meaningful characters
- Should include clear description of changes
- Must not be just whitespace or placeholder text

**What happens if validation fails?**
- The PR will be blocked from merging
- Clear error messages will guide contributors on how to fix issues
- Status checks will show as failed until issues are resolved

**Bypassing validation**:
PRs with these labels will skip validation:
- `dependencies` (for automated dependency updates)
- `automated-pr` (for bot-generated PRs)

For more details, see [CONTRIBUTING.md](../../CONTRIBUTING.md#pull-request-standards).