# Best Practices

This document outlines the coding standards, conventions, and best practices for the General Web Scraper Frontend project.

## 🎯 Code Quality Standards

### General Principles
- **Readability**: Code should be self-documenting and easy to understand
- **Maintainability**: Write code that's easy to modify and extend
- **Performance**: Consider performance implications of your code
- **Security**: Follow security best practices and avoid common vulnerabilities
- **Accessibility**: Ensure your code is accessible to all users

## 📝 Code Style & Formatting

### File Naming Conventions
```
# React Components
Button.tsx              # PascalCase for components
useLocalStorage.ts      # camelCase for hooks
api.ts                  # camelCase for utilities

# Directories
components/             # lowercase, plural
hooks/                  # lowercase, plural
utils/                  # lowercase, plural
```

### Import Organization
```typescript
// 1. External libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal modules (absolute imports)
import { Button } from '@/components/ui';
import { useAppStore } from '@/store';

// 3. Relative imports
import { formatDate } from '../utils';

// 4. Type imports
import type { Job, Recipe } from '@/types';
```

### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Types/Interfaces
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

// 3. Component
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick
}) => {
  // 4. State and hooks
  const [isLoading, setIsLoading] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // 6. Render
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {children}
    </button>
  );
};
```

## 🔧 TypeScript Best Practices

### Type Safety
```typescript
// ✅ Good: Explicit typing
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};

// ❌ Avoid: any type
const getUser = async (id: any): Promise<any> => {
  // implementation
};
```

### Null Safety
```typescript
// ✅ Good: Null checks
const handleSubmit = (data: FormData | null) => {
  if (!data) return;
  // process data
};

// ✅ Good: Optional chaining
const userName = user?.profile?.name || 'Anonymous';

// ❌ Avoid: Non-null assertion
const userName = user!.profile!.name;
```

### Generic Types
```typescript
// ✅ Good: Generic utility functions
const createApiCall = <T>(endpoint: string) => {
  return async (): Promise<T> => {
    const response = await fetch(endpoint);
    return response.json();
  };
};

// Usage
const getUsers = createApiCall<User[]>('/api/users');
```

## ⚛️ React Best Practices

### Hooks Usage
```typescript
// ✅ Good: Proper dependency arrays
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData should be wrapped in useCallback

// ✅ Good: Custom hooks for reusable logic
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = (value: T) => {
    setValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setStoredValue] as const;
};
```

### Performance Optimization
```typescript
// ✅ Good: Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Good: Callback memoization
const handleClick = useCallback(() => {
  // handle click
}, [dependency]);

// ✅ Good: Component memoization
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render logic */}</div>;
});
```

### State Management
```typescript
// ✅ Good: Local state for component-specific data
const [isOpen, setIsOpen] = useState(false);

// ✅ Good: Global state for shared data
const { jobs, addJob } = useAppStore();

// ✅ Good: Derived state
const completedJobs = useMemo(() => 
  jobs.filter(job => job.status === 'completed'),
  [jobs]
);
```

## 🎨 CSS & Styling Best Practices

### Tailwind CSS Usage
```typescript
// ✅ Good: Consistent spacing and sizing
<div className="p-4 m-2 w-full max-w-md">
  <h2 className="text-xl font-semibold mb-4">Title</h2>
</div>

// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Good: Dark mode support
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

### Component Styling
```typescript
// ✅ Good: CSS-in-JS with consistent patterns
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
};

// ✅ Good: Conditional classes
const buttonClass = cn(
  'px-4 py-2 rounded-md font-medium transition-colors',
  buttonVariants[variant],
  disabled && 'opacity-50 cursor-not-allowed'
);
```

## 🧪 Testing Best Practices

### Test Structure
```typescript
// ✅ Good: Descriptive test names
describe('Button Component', () => {
  it('should render with primary variant by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage
```typescript
// ✅ Good: Test all user interactions
it('should handle keyboard navigation', () => {
  render(<Button>Click me</Button>);
  
  const button = screen.getByRole('button');
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});

// ✅ Good: Test edge cases
it('should handle undefined onClick prop', () => {
  render(<Button>Click me</Button>);
  
  const button = screen.getByRole('button');
  expect(() => fireEvent.click(button)).not.toThrow();
});
```

## 🔒 Security Best Practices

### Input Validation
```typescript
// ✅ Good: Validate user input
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Good: Sanitize data before rendering
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};
```

### API Security
```typescript
// ✅ Good: Use HTTPS
const API_BASE_URL = 'https://api.example.com';

// ✅ Good: Validate API responses
const validateApiResponse = (response: unknown): response is ApiResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'status' in response
  );
};
```

## ♿ Accessibility Best Practices

### Semantic HTML
```typescript
// ✅ Good: Use semantic elements
<main>
  <section aria-labelledby="jobs-heading">
    <h2 id="jobs-heading">Available Jobs</h2>
    <ul role="list">
      {jobs.map(job => (
        <li key={job.id} role="listitem">
          {job.title}
        </li>
      ))}
    </ul>
  </section>
</main>

// ✅ Good: Proper ARIA labels
<button
  aria-label="Delete job"
  aria-describedby="delete-warning"
  onClick={handleDelete}
>
  <TrashIcon />
</button>
```

### Keyboard Navigation
```typescript
// ✅ Good: Keyboard event handling
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// ✅ Good: Focus management
useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);
```

## 📊 Performance Best Practices

### Bundle Optimization
```typescript
// ✅ Good: Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// ✅ Good: Tree shaking friendly imports
import { Button } from '@/components/ui/Button';
// Instead of: import { Button } from '@/components/ui';

// ✅ Good: Memoize expensive components
const ExpensiveChart = React.memo(({ data }) => {
  return <Chart data={data} />;
});
```

### Rendering Optimization
```typescript
// ✅ Good: Avoid inline objects and functions
const MemoizedComponent = React.memo(({ config }) => {
  // config is stable, won't cause re-renders
  return <div>{/* render logic */}</div>;
});

// ✅ Good: Use React.memo for expensive renders
const JobList = React.memo(({ jobs, onJobSelect }) => {
  return (
    <ul>
      {jobs.map(job => (
        <JobItem key={job.id} job={job} onSelect={onJobSelect} />
      ))}
    </ul>
  );
});
```

## 🚀 Error Handling Best Practices

### Error Boundaries
```typescript
// ✅ Good: Implement error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
// ✅ Good: Proper error handling in async functions
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
      console.error('Fetch error:', error);
    }
    throw error;
  }
};
```

## 📚 Code Documentation

### JSDoc Comments
```typescript
/**
 * Fetches job details from the API
 * @param id - The unique identifier of the job
 * @param options - Optional configuration for the request
 * @returns Promise resolving to job details
 * @throws {NetworkError} When network request fails
 * @throws {ValidationError} When job ID is invalid
 */
const fetchJobDetails = async (
  id: string,
  options?: RequestOptions
): Promise<Job> => {
  // implementation
};
```

### README Files
```markdown
# Component Name

Brief description of what this component does.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' | 'primary' | Visual style variant |
| children | ReactNode | - | Content to display |

## Usage

```tsx
<Button variant="secondary" onClick={handleClick}>
  Click me
</Button>
```

## Examples

- Basic usage
- With custom styling
- Event handling
```

## 🔄 Code Review Guidelines

### What to Look For
- [ ] Code follows established patterns and conventions
- [ ] Proper error handling and edge cases covered
- [ ] Tests are comprehensive and meaningful
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Security best practices followed
- [ ] Documentation is clear and up-to-date

### Review Checklist
```markdown
## Code Review Checklist

### Functionality
- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled properly?
- [ ] Is error handling appropriate?

### Code Quality
- [ ] Is the code readable and maintainable?
- [ ] Are there any code smells or anti-patterns?
- [ ] Is the code properly tested?

### Performance
- [ ] Are there any performance issues?
- [ ] Is the code optimized appropriately?
- [ ] Are there any memory leaks?

### Security
- [ ] Are there any security vulnerabilities?
- [ ] Is input validation sufficient?
- [ ] Are sensitive operations properly protected?
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainers**: Development Team
