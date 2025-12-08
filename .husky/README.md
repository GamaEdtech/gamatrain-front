# Husky Git Hooks

This directory contains Git hooks managed by Husky.

## Pre-commit Hook

The pre-commit hook runs automatically before each commit to ensure code quality.

### What it does:

1. ✅ **ESLint Check** - Validates code style and catches errors
2. ✅ **Path Check** - Ensures file paths are case-sensitive compatible

### Compatibility:

- ✅ Windows (Git Bash)
- ✅ Windows (WSL)
- ✅ macOS
- ✅ Linux

### If npm is not found:

The hook will show a warning but **allow the commit** to proceed. You should manually run:

```bash
npm run lint:check
npm run check-paths
```

### Manual Testing:

To test the hook manually:

```bash
# On Unix/Linux/macOS/WSL:
sh .husky/pre-commit

# On Windows Git Bash:
bash .husky/pre-commit
```

### Bypassing the Hook (Not Recommended):

If you need to bypass the hook in an emergency:

```bash
git commit --no-verify -m "your message"
```

**Note**: Only use `--no-verify` when absolutely necessary!

## Troubleshooting:

### Hook not running?

1. Make sure Husky is installed:
   ```bash
   npm install
   ```

2. Ensure the hook is executable:
   ```bash
   chmod +x .husky/pre-commit
   ```

3. Check Git hooks are enabled:
   ```bash
   git config core.hooksPath
   # Should output: .husky
   ```

### npm not found?

Make sure Node.js and npm are installed and in your PATH:

```bash
node --version
npm --version
```

If using WSL, ensure npm is installed in WSL, not just Windows.
