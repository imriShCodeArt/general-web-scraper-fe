# Input Validation Implementation

## Overview

This document describes the comprehensive input validation system implemented using Zod schemas for all API endpoints in the General Web Scraper Backend. The implementation provides robust validation for request bodies, query parameters, URL parameters, and headers across all API routes.

## Implementation Details

### 1. Validation Schemas (`src/lib/validation/schemas.ts`)

The validation system is built around comprehensive Zod schemas that define the structure and validation rules for all API inputs:

#### Common Schemas

- **PaginationSchema**: Validates pagination parameters (page, limit)
- **RequestIdSchema**: Validates request ID parameters

#### Health Endpoint Schemas

- **HealthCheckSchema**: Validates health check query parameters
  - `detailed`: boolean (default: false)
  - `includeStack`: boolean (default: false)

#### Recipe Endpoint Schemas

- **RecipeNameParamSchema**: Validates recipe name URL parameters
- **RecipeSiteUrlQuerySchema**: Validates site URL query parameters
- **RecipeValidationBodySchema**: Validates recipe validation request bodies
- **RecipeLoadFromFileBodySchema**: Validates file path parameters

#### Scraping Endpoint Schemas

- **ScrapingInitBodySchema**: Validates scraping initialization requests
  - `siteUrl`: URL string (1-2000 characters)
  - `recipe`: string (1-255 characters)
  - `options`: Optional object with scraping configuration
- **ScrapingJobIdParamSchema**: Validates job ID parameters
- **ScrapingCancelBodySchema**: Validates job cancellation requests

#### Storage Endpoint Schemas

- **StorageJobIdParamSchema**: Validates storage job ID parameters
- **StorageDownloadQuerySchema**: Validates download format parameters
- **StorageCleanupBodySchema**: Validates storage cleanup requests

#### Logs Endpoint Schemas

- **LogsJobIdParamSchema**: Validates log job ID parameters
- **LogsQuerySchema**: Validates log filtering parameters

### 2. Validation Middleware (`src/lib/validation/middleware.ts`)

The middleware system provides flexible validation functions that can be applied to different parts of HTTP requests:

#### Core Validation Functions

- **validateRequest()**: Generic validation middleware factory
- **validateBody()**: Validates request body data
- **validateQuery()**: Validates query parameters
- **validateParams()**: Validates URL parameters
- **validateHeaders()**: Validates request headers
- **validateFileUpload()**: Validates file uploads with size and type restrictions

#### Advanced Features

- **validateMultiple()**: Applies multiple validations to different request parts
- **createValidationSchema()**: Utility for creating custom schemas with options
- **CommonValidations**: Pre-built validation patterns for common data types

### 3. API Endpoint Updates

#### Health Endpoint (`src/app/api/health/route.ts`)

- Added query parameter validation using `HealthCheckSchema`
- Enhanced error handling for validation failures
- Improved response structure with validated parameters

#### Recipes API (`src/app/api/recipes/route.ts`)

- **GET /get/:recipeName**: Added parameter validation
- **GET /getBySite**: Added query parameter validation
- **POST /validate**: Added request body validation
- **POST /loadFromFile**: Added request body validation

#### Scraping API (`src/server.ts`)

- **POST /api/scrape/init**: Added comprehensive request body validation
- **GET /api/scrape/status/:jobId**: Added parameter validation
- **POST /api/scrape/cancel/:jobId**: Added parameter validation

#### Storage API (`src/server.ts`)

- **GET /api/storage/job/:jobId**: Added parameter validation

## Validation Features

### 1. Type Safety

- All validated data is properly typed using TypeScript
- Zod schemas provide compile-time and runtime type checking
- Automatic type inference for validated request data

### 2. Error Handling

- Comprehensive error messages with field-specific details
- Structured error responses with validation context
- Proper HTTP status codes (400 for validation errors)

### 3. Data Sanitization

- Automatic type coercion (e.g., string to number)
- Default value assignment
- Unknown field stripping
- Input length and format validation

### 4. Security Features

- URL validation for external links
- File type and size restrictions
- Input length limits to prevent DoS attacks
- XSS prevention through proper validation

## Usage Examples

### Basic Validation

```typescript
import { validateBody, ScrapingInitBodySchema } from '../lib/validation';

app.post('/api/scrape/init', validateBody(ScrapingInitBodySchema), async (req, res) => {
  // req.body is now validated and typed
  const { siteUrl, recipe, options } = req.body;
  // ... handler logic
});
```

### Multiple Validations

```typescript
import {
  validateParams,
  validateQuery,
  RecipeNameParamSchema,
  PaginationSchema,
} from '../lib/validation';

app.get(
  '/api/recipes/:recipeName',
  validateParams(RecipeNameParamSchema),
  validateQuery(PaginationSchema),
  async (req, res) => {
    // Both req.params and req.query are validated
    const { recipeName } = req.params;
    const { page, limit } = req.query;
    // ... handler logic
  },
);
```

### Custom Validation

```typescript
import { createValidationSchema, CommonValidations } from '../lib/validation';

const CustomSchema = createValidationSchema(
  {
    email: CommonValidations.email,
    age: CommonValidations.positiveInt,
    website: CommonValidations.url,
  },
  { strict: true },
);

app.post('/api/custom', validateBody(CustomSchema), async (req, res) => {
  // Custom validation applied
});
```

## Error Response Format

When validation fails, the API returns a structured error response:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "siteUrl",
        "message": "Invalid url",
        "received": "not-a-url",
        "code": "invalid_string"
      }
    ],
    "target": "body"
  },
  "message": "Request validation failed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "abc123-def456"
}
```

## Benefits

### 1. Improved Security

- Prevents injection attacks through input validation
- Validates data types and formats
- Enforces length limits and constraints

### 2. Better Developer Experience

- Clear error messages for debugging
- Type-safe request handling
- Consistent validation across all endpoints

### 3. API Reliability

- Prevents malformed requests from reaching business logic
- Ensures data integrity throughout the application
- Reduces runtime errors from invalid inputs

### 4. Maintainability

- Centralized validation logic
- Reusable validation schemas
- Easy to extend and modify

## Testing

The validation system can be tested by sending requests with invalid data:

```bash
# Test invalid URL
curl -X POST http://localhost:3000/api/scrape/init \
  -H "Content-Type: application/json" \
  -d '{"siteUrl": "not-a-url", "recipe": "test"}'

# Test missing required field
curl -X POST http://localhost:3000/api/scrape/init \
  -H "Content-Type: application/json" \
  -d '{"recipe": "test"}'

# Test invalid parameter type
curl -X GET "http://localhost:3000/api/recipes/get/123?page=invalid"
```

## Future Enhancements

1. **Rate Limiting Integration**: Combine validation with rate limiting
2. **Caching**: Cache validation results for performance
3. **Custom Validators**: Add domain-specific validation rules
4. **Async Validation**: Support for asynchronous validation (e.g., database lookups)
5. **Validation Metrics**: Track validation success/failure rates

## Conclusion

The input validation implementation provides a robust, type-safe, and maintainable solution for validating all API inputs. It enhances security, improves developer experience, and ensures API reliability while maintaining clean, readable code.

The system is designed to be extensible and can easily accommodate new endpoints and validation requirements as the application grows.
