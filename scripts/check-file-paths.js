#!/usr/bin/env node

/**
 * Development Script: File Path Case Sensitivity Checker
 *
 * This script is for development use only and is not served publicly.
 * It helps prevent issues when deploying to case-sensitive file systems (Linux/macOS)
 * while developing on case-insensitive systems (Windows).
 *
 * Location: /scripts/ directory (not publicly accessible)
 * Usage: npm run check-paths
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line no-unused-vars
const __dirname = path.dirname(__filename)

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Function to extract file paths from Vue/JS/TS files
function extractFilePaths(content) {
  const patterns = [
    // Image src attributes - focus on public/images paths
    /src=["']([^"']*\/images\/[^"']*\.(png|jpg|jpeg|gif|svg|webp))["']/gi,
    // CSS background images in public/images
    /url\(["']?([^"')]*\/images\/[^"')]*\.(png|jpg|jpeg|gif|svg|webp))["']?\)/gi,
  ]

  const paths = []
  patterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      paths.push(match[1])
    }
  })

  return paths
}

// Resolve a referenced path the way Nuxt does: `/` is public/, `@/` and `~/` are the
// app/ srcDir, `@@/` and `~~/` are the project root, anything else is relative to the file
function resolveReferencedPath(filePath, sourceFile) {
  if (filePath.startsWith('/')) return path.resolve(`public${filePath}`)
  if (/^(@@|~~)\//.test(filePath)) return path.resolve(filePath.slice(3))
  if (/^[@~]\//.test(filePath)) return path.resolve('app', filePath.slice(2))
  return path.resolve(path.dirname(sourceFile), filePath)
}

// Function to check if a file exists with exact case
function checkFileExists(filePath, sourceFile) {
  try {
    const absolutePath = resolveReferencedPath(filePath, sourceFile)

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      return { exists: false, actualPath: null }
    }

    // Get the actual file name from the directory
    const dir = path.dirname(absolutePath)
    const fileName = path.basename(absolutePath)

    if (!fs.existsSync(dir)) {
      return { exists: false, actualPath: null }
    }

    const files = fs.readdirSync(dir)
    const actualFile = files.find(f => f.toLowerCase() === fileName.toLowerCase())

    if (!actualFile) {
      return { exists: false, actualPath: null }
    }

    const actualPath = path.join(dir, actualFile)
    const exactMatch = actualFile === fileName

    return {
      exists: true,
      exactMatch,
      actualPath,
      actualFileName: actualFile,
    }
  }
  catch (error) {
    return { exists: false, actualPath: null, error: error.message }
  }
}

// Main function
async function checkFilePaths() {
  log('blue', '🔍 Checking file path case sensitivity...\n')

  const files = glob.sync('**/*.{vue,js,ts}', {
    ignore: ['node_modules/**', '.nuxt/**', '.output/**', 'dist/**'],
  })

  let issuesFound = 0
  const issues = []

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const referencedPaths = extractFilePaths(content)

      for (const referencedPath of referencedPaths) {
        // Skip external URLs
        if (referencedPath.startsWith('http') || referencedPath.startsWith('//')) {
          continue
        }

        const result = checkFileExists(referencedPath, file)

        if (!result.exists) {
          issues.push({
            file,
            referencedPath,
            issue: 'File not found',
            severity: 'error',
          })
          issuesFound++
        }
        else if (!result.exactMatch) {
          issues.push({
            file,
            referencedPath,
            actualFileName: result.actualFileName,
            issue: 'Case mismatch',
            severity: 'warning',
          })
          issuesFound++
        }
      }
    }
    catch (error) {
      log('red', `Error reading file ${file}: ${error.message}`)
    }
  }

  // Report results
  if (issuesFound === 0) {
    log('green', '✅ No file path case sensitivity issues found!')
  }
  else {
    log('red', `❌ Found ${issuesFound} file path issues:\n`)

    // Group issues by type
    const caseMismatchIssues = issues.filter(i => i.actualFileName)
    const notFoundIssues = issues.filter(i => !i.actualFileName)

    if (caseMismatchIssues.length > 0) {
      log('yellow', '🔤 CASE SENSITIVITY ISSUES (Critical for Linux/macOS):')
      caseMismatchIssues.forEach((issue) => {
        log('yellow', `  📁 ${issue.file}`)
        log('yellow', `     Referenced: ${issue.referencedPath}`)
        log('yellow', `     Actual file: ${issue.actualFileName}`)
        log('yellow', `     ⚠️  Case mismatch detected!\n`)
      })
    }

    if (notFoundIssues.length > 0) {
      log('red', '❌ MISSING FILES:')
      notFoundIssues.forEach((issue) => {
        log('red', `  📁 ${issue.file}`)
        log('red', `     Missing: ${issue.referencedPath}\n`)
      })
    }

    log('blue', '💡 SOLUTIONS:')
    log('blue', '1. 🔧 Fix case mismatches immediately (critical for deployment)')
    log('blue', '2. 📝 Use consistent naming: lowercase with hyphens')
    log('blue', '3. 🚀 Run "npm run check-paths" before commits')
    log('blue', '4. 🔍 Use the useSafeImage composable for better error handling')
  }

  // Only return error code for case sensitivity issues, not missing files
  const criticalIssues = issues.filter(i => i.actualFileName).length
  return criticalIssues
}

// Run the check
checkFilePaths().then((issuesCount) => {
  process.exit(issuesCount > 0 ? 1 : 0)
}).catch((error) => {
  log('red', `Error: ${error.message}`)
  process.exit(1)
})

export { checkFilePaths }
