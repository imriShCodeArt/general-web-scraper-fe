# Error Handling Consistency

This document outlines the standardized error handling approach implemented across the entire codebase to ensure consistency and maintainability.

## Overview

Previously, the codebase had mixed error handling patterns:

- Some routes used `console.error` with generic error messages
- Others used the existing `ErrorFactory` and `ErrorBoundary`
- Inconsistent error response formats across endpoints
- Library files had scattered error handling without standardization

The new implementation standardizes all error handling using the existing `ErrorFactory` and introduces specialized error handler utilities for different contexts.

## Architecture

### Core Components

1. **ErrorFactory** (`src/lib/error-handler.ts`)
   - Creates consistent error instances with proper typing
   - Provides error codes, context, and metadata
   - Supports both `ScrapingError` and `ValidationError` types

2. **ApiErrorHandler** (`src/lib/api-error-handler.ts`)
   - Standardized API error response handler
   - Consistent error response format across all endpoints
   - Convenience methods for common error scenarios

3. **LibraryErrorHandler** (`src/lib/library-error-handler.ts`)
   - **NEW**: Standardized error handling for library files
   - Replaces `console.error` with structured error creation and logging
   - Maintains error context for debugging while providing consistent error types

4. **CliErrorHandler** (`src/lib/cli-error-handler.ts`)
   - **NEW**: User-friendly error handling for CLI tools
   - Provides structured error messages with emojis and context
   - Maintains consistency with the error handling system

5. **ErrorBoundary** (`src/lib/error-handler.ts`)
   - Graceful error handling with registered handlers
   - Fallback error handling mechanisms
   - Context-aware error processing

## Standardized Error Response Format

All API error responses now follow this consistent format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "additional": "context information"
  }
}
```

### Response Fields

- **success**: Always `false` for error responses
- **error**: Human-readable error message
- **code**: Error code from the `ErrorCodes` enum
- **timestamp**: ISO timestamp when the error occurred
- **context**: Optional additional context information

## Usage Examples

### API Error Handling

```typescript
import { ApiErrorHandler } from '../../../lib/api-error-handler';

try {
  // ... API logic
} catch (error) {
  ApiErrorHandler.handleCaughtError(res, error, 'Operation failed');
}
```

### Library Error Handling

```typescript
import { LibraryErrorHandler } from './library-error-handler';

try {
  // ... library logic
} catch (error) {
  LibraryErrorHandler.createAndLogParseError(
    'Failed to process page',
    { url: currentUrl, pageIndex: i },
    error,
  );
  // The error is logged and returned, you can then throw it or handle it
}
```

### CLI Error Handling

```typescript
import { CliErrorHandler } from '../lib/cli-error-handler';

try {
  // ... CLI logic
} catch (error) {
  CliErrorHandler.handleError(error, 'perform operation', { operation: 'CLI task' });
}
```

## Error Codes

The system uses predefined error codes for consistent categorization:

- `VALIDATION_ERROR`: Input validation failures
- `RECIPE_ERROR`: Recipe-related operation failures
- `NETWORK_ERROR`: Network and connectivity issues
- `PARSE_ERROR`: Data parsing failures
- `TIMEOUT_ERROR`: Operation timeout
- `STORAGE_ERROR`: Storage operation failures
- `UNKNOWN_ERROR`: Unclassified errors

## Migration Guide

### Before (Inconsistent)

```typescript
// Old pattern - inconsistent
} catch (error) {
  console.error('Failed to process:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
```

### After (Standardized)

```typescript
// New pattern - consistent
} catch (error) {
  ApiErrorHandler.handleCaughtError(res, error, 'Failed to process');
}
```

### Library Files

```typescript
// Before
} catch (error) {
  console.error('Failed to process page:', error);
}

// After
} catch (error) {
  LibraryErrorHandler.createAndLogParseError(
    'Failed to process page',
    { url: currentUrl, pageIndex: i },
    error,
  );
}
```

### CLI Tools

```typescript
// Before
} catch (error) {
  console.error('Failed to perform operation:', error);
  process.exit(1);
}

// After
} catch (error) {
  CliErrorHandler.handleError(error, 'perform operation', { operation: 'CLI task' });
}
```

## Benefits

1. **Consistency**: All parts of the codebase return errors in the same format
2. **Maintainability**: Centralized error handling logic
3. **Debugging**: Rich error context and standardized error codes
4. **User Experience**: Consistent error messages across the API and CLI
5. **Monitoring**: Structured error data for logging and analytics
6. **Type Safety**: Proper TypeScript error types throughout the system

## Implementation Status

### ✅ Completed

- **API Routes**: All routes in `src/app/api/recipes/route.ts` ✅
- **Main Server**: All routes in `src/server.ts` ✅
- **Library Files**: All core library files updated ✅
  - `src/lib/storage.ts` ✅
  - `src/lib/base-adapter.ts` ✅
  - `src/lib/enhanced-base-adapter.ts` ✅
  - `src/lib/generic-adapter.ts` ✅
  - `src/lib/puppeteer-http-client.ts` ✅
- **CLI Tools**: All CLI files updated ✅
  - `src/cli/recipe-cli.ts` ✅
  - `src/test-recipe-system.ts` ✅
- **Error Handlers**: All utility classes created ✅
  - `ApiErrorHandler` ✅
  - `LibraryErrorHandler` ✅
  - `CliErrorHandler` ✅
- **Documentation**: Comprehensive documentation created ✅
- **Testing**: Test coverage for all new error handlers ✅

### 🔄 Next Steps

- Monitor error response consistency in production
- Consider adding error analytics and monitoring
- Evaluate performance impact of structured error handling

## Testing

The new error handling can be tested by:

1. **API Tests**: Making invalid requests to API endpoints
2. **Library Tests**: Running the library error handler tests
3. **CLI Tests**: Running the CLI error handler tests
4. **Integration Tests**: Testing error boundary functionality

### Running Tests

```bash
# Test all error handlers
npm test -- --testPathPattern="error-handler|library-error-handler|cli-error-handler"

# Test specific handler
npm test -- --testPathPattern="library-error-handler"
```

## Best Practices

1. **Always use appropriate error handler** for your context:
   - `ApiErrorHandler` for API routes
   - `LibraryErrorHandler` for library functions
   - `CliErrorHandler` for CLI tools
2. **Provide meaningful context** in error responses
3. **Use appropriate error codes** for categorization
4. **Log errors appropriately** before sending responses
5. **Handle cleanup** in finally blocks
6. **Maintain backward compatibility** when possible

## Troubleshooting

### Common Issues

1. **Missing Error Handler Import**: Ensure the appropriate error handler is imported
2. **Incorrect Error Codes**: Use predefined codes from the `ErrorCodes` enum
3. **Missing Context**: Provide relevant context for debugging
4. **Type Mismatches**: Ensure error types match the expected interfaces

### Debug Mode

For development, error responses include additional context information. In production, sensitive information is filtered out.

## Future Enhancements

1. **Error Rate Limiting**: Implement rate limiting for error responses
2. **Error Analytics**: Add error tracking and analytics
3. **Custom Error Types**: Extend error types for specific use cases
4. **Internationalization**: Support for multiple languages in error messages
5. **Error Recovery**: Implement automatic error recovery mechanisms
6. **Performance Monitoring**: Track error handling performance impact
