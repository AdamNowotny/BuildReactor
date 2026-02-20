# AGENTS.md

This file provides guidelines for AI coding agents working in this repository.

## Project Overview

BuildReactor is a browser extension (Chrome/Firefox) that provides developer notifications and dashboard for CI servers. Built with React, TypeScript, and Vite.

## Build Commands

```bash
# Development
npm run dev              # Start Vite dev server (Chrome)
npm run dev:mock         # Dev server with mock worker
npm run dev:firefox      # Dev server for Firefox

# Build
npm run dist             # Build for Chrome
npm run dist:firefox     # Build for Firefox

# Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode
```

## Running Single Tests

```bash
# Run a specific test file
npx vitest run src/services/jenkins/jenkins.test.ts

# Run tests matching a pattern
npx vitest run -t "getPipelines"

# Run tests in watch mode for specific file
npx vitest src/services/jenkins/jenkins.test.ts
```

## Code Style Guidelines

### TypeScript
- Target: ESNext with strict null checks enabled
- Use `type` keyword for type imports: `import type { Foo } from 'bar'`
- Prefer arrow functions (`prefer-arrow-callback` rule)
- Use object shorthand (`object-shorthand: 'always'`)
- No implicit any allowed

### Naming Conventions
- Use camelCase for variables, functions, and properties
- Use PascalCase for React components, interfaces, and types
- Use SCREAMING_SNAKE_CASE for constants
- Prefix unused parameters/variables with underscore: `_unused`

### Imports
- Group imports: external libs, internal modules, types
- Sort object keys alphabetically for objects with 10+ keys
- Use multiline import declarations for complex imports
- Example:
  ```typescript
  import logger from 'common/logger';
  import request from 'service-worker/request';
  import type { CIBuild, CIPipeline } from 'common/types';
  ```

### Formatting (Prettier)
- Single quotes
- 4-space indentation (2 spaces for JSON files)
- Semicolons required
- Trailing commas: all
- Print width: 90 characters
- Arrow function parentheses: avoid when possible

### React Components
- Use functional components with default exports
- Type props inline in component parameters
- Place styles in separate `.css` files alongside component
- Use lowercase for default-exported anonymous components

### Error Handling
- Use try-catch for async operations
- Return error objects in CI service results, don't throw
- Use optional chaining and nullish coalescing

### Testing (Vitest)
- Test files: `*.test.ts` or `*.test.tsx`
- Place tests alongside source files (not in separate test folder)
- Use `vi.mock()` for mocking dependencies
- Use `beforeEach` for test setup
- Mock external services, not internal logic
- **Unit tests only**: Test business logic, not React components
- **Don't extract logic just for testing** - only test what can be easily tested without modifying the component structure

### ESLint Rules to Note
- `no-console: error` - Use logger instead
- `@typescript-eslint/no-unused-vars` - Strict unused variable checking
- `sort-keys: error` - Sort object keys alphabetically (10+ keys)
- `react/display-name: off` - Anonymous components allowed

## File Structure

```
src/
  common/           # Shared utilities, types, components
  service-worker/   # Extension background scripts
  services/         # CI service implementations (jenkins, github, etc.)
```

## Key Dependencies

- React 19, React Bootstrap
- RxJS 7.8.2 (modern, stable)
- Vite with CRXJS plugin for extension builds
- Vitest for testing
- TypeScript with strict mode

## Dependency Management

- **Lock all versions**: Always use exact versions in `package.json` (no `^` or `~` prefixes)
- This ensures reproducible builds and avoids unexpected breaking changes from transitive dependencies
- When updating dependencies, explicitly set the exact version number
