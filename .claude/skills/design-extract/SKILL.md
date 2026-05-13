```markdown
# design-extract Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the development patterns and conventions used in the `design-extract` TypeScript codebase. You'll learn how to structure files, write imports and exports, follow commit message conventions, and organize tests. This guide ensures consistency and maintainability across the project.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - Example:  
    ```
    design-utils.ts
    extract-colors.test.ts
    ```

### Import Style
- Use **relative imports** for referencing other modules.
  - Example:
    ```typescript
    import { extractColors } from './extract-colors';
    ```

### Export Style
- Use **named exports** for all exported functions, types, or constants.
  - Example:
    ```typescript
    // extract-colors.ts
    export function extractColors(input: string): string[] { ... }
    ```

### Commit Messages
- Follow the **Conventional Commits** standard.
- Use the `chore` prefix for maintenance or non-feature commits.
  - Example:
    ```
    chore: update dependencies to latest versions
    ```

## Workflows

### Code Contribution
**Trigger:** When adding or updating code
**Command:** `/contribute-code`

1. Create or update files using kebab-case naming.
2. Use relative imports and named exports.
3. Write or update corresponding test files (`*.test.ts`).
4. Commit changes using the conventional commit format (e.g., `chore: ...`).

### Testing
**Trigger:** When verifying code correctness
**Command:** `/run-tests`

1. Identify test files matching the `*.test.*` pattern.
2. Run tests using the project's preferred test runner (framework is unspecified; check project documentation or scripts).
3. Review test results and fix any failing cases.

### Dependency Maintenance
**Trigger:** When updating project dependencies
**Command:** `/update-dependencies`

1. Update dependencies as needed.
2. Ensure all tests pass after updates.
3. Commit changes with a message like `chore: update dependencies`.

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `extract-colors.test.ts`).
- The specific testing framework is not specified; refer to project scripts or documentation for details.
- Place tests alongside or near the code they validate.

  Example:
  ```
  src/
    extract-colors.ts
    extract-colors.test.ts
  ```

## Commands
| Command             | Purpose                                     |
|---------------------|---------------------------------------------|
| /contribute-code    | Guide for adding or updating code           |
| /run-tests          | Run all test files in the project           |
| /update-dependencies| Update and commit project dependencies      |
```