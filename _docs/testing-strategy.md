# Testing Strategy

This document outlines the testing strategy, frameworks, and guidelines for the General Web Scraper Frontend project.

## 🎯 Testing Philosophy

### Testing Pyramid
Our testing strategy follows the testing pyramid approach:

```
        /\
       /  \     E2E Tests (Few)
      /____\    Integration Tests (Some)
     /      \   Unit Tests (Many)
    /________\
```

- **Unit Tests**: Fast, focused, test individual components/functions
- **Integration Tests**: Test component interactions and API integration
- **E2E Tests**: Test complete user journeys and critical paths

### Testing Principles
- **Fast Feedback**: Tests should run quickly to provide immediate feedback
- **Reliable**: Tests should be deterministic and not flaky
- **Maintainable**: Tests should be easy to understand and modify
- **Comprehensive**: Cover critical functionality and edge cases
- **Realistic**: Test real user scenarios, not implementation details

## 🛠️ Testing Stack

### Core Testing Framework
- **Vitest**: Fast unit testing framework with React Testing Library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **Playwright**: E2E testing (optional, for critical user flows)

### Testing Utilities
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/react-hooks**: Hook testing utilities
- **vi**: Vitest's mocking and spying utilities

## 📁 Test Organization

### Directory Structure
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx      # Component tests
│   │   └── index.ts
│   └── __tests__/               # Shared test utilities
├── hooks/
│   ├── useLocalStorage.ts
│   └── useLocalStorage.test.ts  # Hook tests
├── utils/
│   ├── index.ts
│   └── __tests__/               # Utility function tests
└── test/
    ├── setup.ts                  # Test configuration
    ├── utils.ts                  # Test helpers
    └── mocks/                    # Mock data and services
```

### Test File Naming
- **Component Tests**: `ComponentName.test.tsx`
- **Hook Tests**: `hookName.test.ts`
- **Utility Tests**: `utilityName.test.ts`
- **Integration Tests**: `ComponentName.integration.test.tsx`

## 🧪 Unit Testing

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates stored value when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });
});
```

### Utility Function Testing
```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, validateEmail } from './utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('Jan 15, 2024');
    });

    it('handles invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      const formatted = formatDate(invalidDate);
      expect(formatted).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });
});
```

## 🔗 Integration Testing

### Component Integration
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JobList } from './JobList';
import { useAppStore } from '@/store';

// Mock the store
vi.mock('@/store', () => ({
  useAppStore: vi.fn()
}));

describe('JobList Integration', () => {
  it('fetches and displays jobs from store', async () => {
    const mockJobs = [
      { id: '1', title: 'Job 1', status: 'pending' },
      { id: '2', title: 'Job 2', status: 'completed' }
    ];

    (useAppStore as any).mockReturnValue({
      jobs: mockJobs,
      fetchJobs: vi.fn()
    });

    render(<JobList />);

    await waitFor(() => {
      expect(screen.getByText('Job 1')).toBeInTheDocument();
      expect(screen.getByText('Job 2')).toBeInTheDocument();
    });
  });
});
```

### API Integration Testing
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { JobDetail } from './JobDetail';

const server = setupServer(
  rest.get('/api/jobs/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '1',
        title: 'Test Job',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('JobDetail API Integration', () => {
  it('fetches and displays job details', async () => {
    render(<JobDetail jobId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Test Job')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/jobs/:id', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<JobDetail jobId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## 🌐 E2E Testing

### Critical User Flows
```typescript
import { test, expect } from '@playwright/test';

test.describe('Job Management E2E', () => {
  test('user can create a new job', async ({ page }) => {
    await page.goto('/jobs');
    
    // Click create job button
    await page.click('[data-testid="create-job-button"]');
    
    // Fill job form
    await page.fill('[data-testid="job-title-input"]', 'Test Job');
    await page.fill('[data-testid="job-url-input"]', 'https://example.com');
    await page.selectOption('[data-testid="job-recipe-select"]', 'basic-scraper');
    
    // Submit form
    await page.click('[data-testid="submit-job-button"]');
    
    // Verify job was created
    await expect(page.locator('[data-testid="job-list"]')).toContainText('Test Job');
  });

  test('user can view job details', async ({ page }) => {
    await page.goto('/jobs');
    
    // Click on first job
    await page.click('[data-testid="job-item"]:first-child');
    
    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/jobs\/\d+/);
    await expect(page.locator('[data-testid="job-title"]')).toBeVisible();
  });
});
```

## 🎭 Mocking Strategies

### API Mocking with MSW
```typescript
// test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/jobs', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', title: 'Mock Job 1', status: 'pending' },
        { id: '2', title: 'Mock Job 2', status: 'completed' }
      ])
    );
  }),

  rest.post('/api/jobs', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json({
        id: '3',
        ...body,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
    );
  })
];
```

### Store Mocking
```typescript
// test/mocks/store.ts
import { vi } from 'vitest';

export const mockStore = {
  jobs: [],
  recipes: [],
  fetchJobs: vi.fn(),
  addJob: vi.fn(),
  updateJob: vi.fn(),
  deleteJob: vi.fn()
};

vi.mock('@/store', () => ({
  useAppStore: () => mockStore
}));
```

### Component Mocking
```typescript
// test/mocks/components.ts
import { vi } from 'vitest';

export const MockButton = vi.fn(({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
));

vi.mock('@/components/ui/Button', () => ({
  Button: MockButton
}));
```

## 📊 Test Coverage

### Coverage Goals
- **Statements**: 80% minimum
- **Branches**: 75% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### Coverage Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    }
  }
});
```

## 🚀 Performance Testing

### Component Performance
```typescript
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button Performance', () => {
  it('renders quickly', () => {
    const startTime = performance.now();
    
    render(<Button>Click me</Button>);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });
});
```

### Bundle Size Testing
```typescript
// test/bundle-size.test.ts
import { describe, it, expect } from 'vitest';
import { build } from 'vite';

describe('Bundle Size', () => {
  it('main bundle is under size limit', async () => {
    const result = await build({
      configFile: 'vite.config.ts'
    });

    const mainBundle = result.output.find(
      output => output.fileName === 'assets/index-[hash].js'
    );

    expect(mainBundle?.code?.length).toBeLessThan(500 * 1024); // 500KB limit
  });
});
```

## 🔧 Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
```

## 📋 Testing Checklist

### Before Writing Tests
- [ ] Understand the component/function requirements
- [ ] Identify critical user paths and edge cases
- [ ] Plan test scenarios and coverage goals
- [ ] Set up appropriate mocks and test data

### Writing Tests
- [ ] Use descriptive test names that explain the scenario
- [ ] Test one behavior per test case
- [ ] Arrange, Act, Assert pattern
- [ ] Use semantic queries (getByRole, getByLabelText)
- [ ] Test accessibility features
- [ ] Mock external dependencies appropriately

### After Writing Tests
- [ ] Run tests locally before committing
- [ ] Ensure tests pass consistently
- [ ] Check test coverage meets goals
- [ ] Review tests for maintainability
- [ ] Update tests when requirements change

## 🚨 Common Testing Pitfalls

### Avoid These Practices
```typescript
// ❌ Don't test implementation details
it('should call setState', () => {
  const setState = vi.fn();
  // Testing internal state management
});

// ❌ Don't test third-party libraries
it('should render with Tailwind classes', () => {
  // Tailwind is tested by the library maintainers
});

// ❌ Don't test trivial functionality
it('should render children', () => {
  render(<Button>Text</Button>);
  expect(screen.getByText('Text')).toBeInTheDocument();
});

// ❌ Don't use data-testid for everything
it('should show button', () => {
  expect(screen.getByTestId('submit-button')).toBeInTheDocument();
});
```

### Better Alternatives
```typescript
// ✅ Test user behavior
it('should submit form when button is clicked', () => {
  const onSubmit = vi.fn();
  render(<Form onSubmit={onSubmit} />);
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(onSubmit).toHaveBeenCalled();
});

// ✅ Test accessibility and semantics
it('should be accessible to screen readers', () => {
  render(<Button aria-label="Submit form">Submit</Button>);
  expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument();
});

// ✅ Test meaningful user interactions
it('should show success message after form submission', async () => {
  render(<Form />);
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(screen.getByText('Form submitted successfully')).toBeInTheDocument();
  });
});
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Testing](https://playwright.dev/)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainers**: Development Team
