# Testing Guide

## Overview

This project includes a comprehensive testing setup with three types of tests:

1. **Unit Tests** - Test individual components and utilities
2. **Integration Tests** - Test API endpoints and backend functionality
3. **End-to-End Tests** - Test complete user workflows

## Testing Stack

- **Vitest** - Fast unit testing framework with Vite integration
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - DOM assertion matchers
- **Supertest** - HTTP endpoint testing
- **Playwright** - End-to-end browser testing

## Running Tests

### Unit & Integration Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e -- --headed
```

## Test Structure

### Frontend Tests
```
client/src/
├── components/
│   └── ui/
│       └── __tests__/
│           └── button.test.tsx
├── lib/
│   └── __tests__/
│       └── utils.test.ts
└── test/
    ├── setup.ts
    └── utils/
        └── test-utils.tsx
```

### Backend Tests
```
server/
└── __tests__/
    └── routes.test.ts
```

### E2E Tests
```
e2e/
└── example.spec.ts
```

## Configuration Files

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `client/src/test/setup.ts` - Test setup and global configurations
- `client/src/test/utils/test-utils.tsx` - Custom render helpers

## Writing Tests

### Component Tests
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import { Button } from '../button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### API Tests
```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('API Routes', () => {
  it('should return jobs', async () => {
    const response = await request(app)
      .get('/api/jobs')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
  })
})
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test'

test('should navigate to dashboard', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Dashboard')
  await expect(page).toHaveURL(/dashboard/)
})
```

## Test Environment

### Environment Variables
Tests use `.env.test` for configuration with isolated test settings.

### Database
- Unit tests: Use mocked storage layer
- Integration tests: In-memory SQLite database
- E2E tests: Test database or mocked endpoints

### Coverage
Coverage reports are generated in the `coverage/` directory and include:
- Line coverage
- Function coverage
- Branch coverage
- HTML reports

## Best Practices

1. **Isolation** - Each test should be independent
2. **Descriptive Names** - Use clear test descriptions
3. **Arrange-Act-Assert** - Structure tests clearly
4. **Mock External Dependencies** - Keep tests fast and reliable
5. **Test User Behavior** - Focus on user interactions over implementation

## Mobile Testing

Playwright is configured to test multiple viewports including:
- Desktop Chrome
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Continuous Integration

All tests run automatically on:
- Pull requests
- Main branch commits
- Scheduled nightly runs

## Debugging Tests

### Unit Tests
```bash
# Debug with VS Code
npm run test:ui

# Debug specific test
npm test -- --run button.test
```

### E2E Tests
```bash
# Run with browser visible
npm run test:e2e -- --headed

# Debug with Playwright Inspector
npm run test:e2e -- --debug
```

## Common Issues

1. **Tests timing out** - Increase timeout in config
2. **Module resolution** - Check path aliases in vitest.config.ts
3. **Environment issues** - Verify .env.test configuration
4. **Browser issues** - Run `npx playwright install` to reinstall browsers