# File Path Case Sensitivity Validation

This project includes tools to prevent case sensitivity issues in file paths that commonly occur when deploying to Linux/macOS systems.

## Problem

On Windows, the file system is case-insensitive, meaning `image.PNG` and `image.png` are treated as the same file. However, on Linux and macOS, the file system is case-sensitive, and these would be considered different files.

## Implemented Solutions

### 1. Path Checking Script (`scripts/check-file-paths.js`)

A script that scans all Vue/JS/TS files and identifies case sensitivity issues in image paths.

**Usage:**
```bash
npm run check-paths
```

**Features:**
- Checks image paths in `/images/` directory
- Detects case mismatches and missing files
- Clear display of issues and solutions
- Only case sensitivity issues cause failures

### 2. Pre-commit Hook

Every commit is automatically checked to prevent case sensitivity issues from being committed.

**File:** `.husky/pre-commit`

### 3. Safe Composable (`composables/useSafeImage.js`)

A tool for safe image management with better error handling.

**Usage:**
```javascript
const { createImageLoadHandler, getSafeImagePath } = useSafeImage()

// In template
<img 
  :src="getSafeImagePath('/images/my-image.png')"
  @error="createImageLoadHandler()"
  alt="My Image"
>
```

### 4. Development Plugin (`plugins/file-path-validator.client.js`)

In development mode, automatically validates images and warns in console.

**Features:**
- Only active in development mode
- Automatic validation after page load
- Console warnings for broken images

## Best Practices

### 1. File Naming
```bash
# ✅ Correct
my-image.png
user-avatar.jpg
logo-small.svg

# ❌ Incorrect
MyImage.PNG
User_Avatar.JPG
logoSmall.SVG
```

### 2. Before Committing
```bash
# Always run before commit
npm run check-paths

# Or lint and check-paths together
npm run pre-commit
```

### 3. In Components
```vue
<template>
  <img 
    src="/images/token/my-token.svg"
    alt="Token"
    @error="handleImageError"
    loading="lazy"
  >
</template>

<script setup>
const { createImageLoadHandler } = useSafeImage()
const handleImageError = createImageLoadHandler()
</script>
```

## Troubleshooting

### Issue: Image works on Windows but not on Linux
1. Run `npm run check-paths`
2. Find the case mismatch
3. Fix the file name or path

### Issue: Pre-commit hook fails
1. Read the script output
2. Fix case sensitivity issues
3. Commit again

### Issue: Image not displayed in development
1. Check browser console
2. Plugin automatically warns
3. Verify file path

## Common Examples

### Before (problematic):
```vue
<img src="/images/token/CTA/CTA_People_mobile.svg" alt="People">
```

### After (correct):
```vue
<img src="/images/token/CTA/CTA_People_Mobile.svg" alt="People">
```

## Important Notes

- ⚠️ Always run `npm run check-paths` before PR
- 🔍 In development, check browser console for warnings
- 📝 Use consistent naming conventions
- 🚀 Pre-commit hook automatically protects you

## Support

If you encounter issues:
1. Run `npm run check-paths`
2. Share the output with the team
3. Use the `useSafeImage` composable