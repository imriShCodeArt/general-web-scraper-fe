# Configuration Management

This document describes the centralized configuration management system for the General Web Scraper Backend.

## Overview

The configuration system provides:

- **Centralized configuration** with Zod validation
- **Environment-specific settings** for development, testing, and production
- **Type-safe configuration access** throughout the application
- **Startup validation** to catch configuration errors early
- **Fallback values** for missing environment variables

## Quick Start

1. Copy `env.example` to `.env`:

   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your values:

   ```bash
   NODE_ENV=development
   PORT=3000
   LOG_LEVEL=info
   ```

3. The configuration service will automatically load and validate your settings.

## Configuration Structure

### Server Configuration

```typescript
server: {
  port: number; // Server port (1-65535)
  host: string; // Server hostname
  nodeEnv: string; // Environment: 'development' | 'test' | 'production'
}
```

### Scraping Configuration

```typescript
scraping: {
  timeout: number; // Request timeout in milliseconds (1000-300000)
  maxConcurrent: number; // Maximum concurrent scraping jobs (1-50)
  userAgent: string; // User agent string for requests
}
```

### Logging Configuration

```typescript
logging: {
  level: string; // Log level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  format: string; // Log format: 'json' | 'pretty'
  debug: boolean; // Debug mode enabled
}
```

### Security Configuration

```typescript
security: {
  jwtSecret?: string;      // JWT signing secret (min 32 chars)
  sessionSecret?: string;  // Session secret (min 32 chars)
}
```

### Rate Limiting

```typescript
rateLimit: {
  windowMs: number; // Time window in milliseconds (1000-3600000)
  maxRequests: number; // Maximum requests per window (1-10000)
}
```

## Environment Variables

| Variable                  | Type    | Default                   | Description                   |
| ------------------------- | ------- | ------------------------- | ----------------------------- |
| `NODE_ENV`                | string  | `development`             | Environment mode              |
| `PORT`                    | number  | `3000`                    | Server port                   |
| `HOST`                    | string  | `localhost`               | Server hostname               |
| `LOG_LEVEL`               | string  | `info`                    | Logging level                 |
| `LOG_FORMAT`              | string  | `json`                    | Log format                    |
| `SCRAPER_DEBUG`           | boolean | `false`                   | Enable debug mode             |
| `SCRAPING_TIMEOUT`        | number  | `30000`                   | Request timeout (ms)          |
| `MAX_CONCURRENT`          | number  | `5`                       | Max concurrent jobs           |
| `USER_AGENT`              | string  | `General-Web-Scraper/2.0` | User agent string             |
| `DATABASE_URL`            | string  | -                         | Database connection URL       |
| `DB_POOL_SIZE`            | number  | `10`                      | Database connection pool size |
| `JWT_SECRET`              | string  | -                         | JWT signing secret            |
| `SESSION_SECRET`          | string  | -                         | Session secret                |
| `RATE_LIMIT_WINDOW_MS`    | number  | `900000`                  | Rate limit window (ms)        |
| `RATE_LIMIT_MAX_REQUESTS` | number  | `100`                     | Max requests per window       |

## Usage in Code

### Basic Configuration Access

```typescript
import { configService } from './lib/config';

// Get complete configuration
const config = configService.getConfig();

// Get specific sections
const serverConfig = configService.getServerConfig();
const loggingConfig = configService.getLoggingConfig();
const scrapingConfig = configService.getScrapingConfig();
```

### Environment Checks

```typescript
import { configService } from './lib/config';

if (configService.isProduction()) {
  // Production-specific logic
}

if (configService.isDebugEnabled()) {
  // Debug-specific logic
}

if (configService.isVercel()) {
  // Vercel-specific logic
}
```

### Configuration Validation

```typescript
import { ConfigValidator } from './lib/config';

// Validate configuration at startup
ConfigValidator.validateStartup();

// Check if configuration is ready
if (ConfigValidator.isReady()) {
  // Configuration is available
}
```

## Environment-Specific Configuration

### Development

```bash
NODE_ENV=development
LOG_LEVEL=debug
SCRAPER_DEBUG=1
PORT=3000
```

### Testing

```bash
NODE_ENV=test
LOG_LEVEL=warn
SCRAPER_DEBUG=0
PORT=3001
```

### Production

```bash
NODE_ENV=production
LOG_LEVEL=info
SCRAPER_DEBUG=0
PORT=3000
JWT_SECRET=your_secure_secret_here
SESSION_SECRET=your_secure_session_secret_here
```

## Validation Rules

### Server Configuration

- Port must be between 1 and 65535
- Host must be a non-empty string
- Node environment must be one of: development, test, production

### Scraping Configuration

- Timeout must be between 1000ms and 300000ms
- Max concurrent must be between 1 and 50
- User agent must be a non-empty string

### Logging Configuration

- Log level must be one of: fatal, error, warn, info, debug, trace
- Log format must be one of: json, pretty

### Security Configuration

- JWT secret must be at least 32 characters (if provided)
- Session secret must be at least 32 characters (if provided)

## Error Handling

The configuration service provides clear error messages for validation failures:

```typescript
try {
  configService.initialize();
} catch (error) {
  console.error('Configuration validation failed:', error.message);
  process.exit(1);
}
```

## Testing

For testing, you can reset the configuration service:

```typescript
import { configService } from './lib/config';

beforeEach(() => {
  configService.reset();
});

test('should load configuration', () => {
  configService.initialize();
  expect(configService.isReady()).toBe(true);
});
```

## Migration from Old System

If you're migrating from the old scattered configuration:

1. **Replace direct `process.env` access**:

   ```typescript
   // Old
   const port = process.env.PORT || 3000;

   // New
   const port = configService.getServerConfig().port;
   ```

2. **Replace debug checks**:

   ```typescript
   // Old
   if (process.env.SCRAPER_DEBUG === '1') {
     console.log('Debug info');
   }

   // New
   if (configService.isDebugEnabled()) {
     console.log('Debug info');
   }
   ```

3. **Update imports**:

   ```typescript
   // Old
   import { AppConfig } from './lib/composition-root';

   // New
   import { type AppConfig } from './lib/config';
   ```

## Best Practices

1. **Always validate configuration at startup** using `ConfigValidator.validateStartup()`
2. **Use the configuration service** instead of accessing `process.env` directly
3. **Provide sensible defaults** for all configuration values
4. **Use environment-specific configuration files** for different deployment stages
5. **Validate sensitive configuration** like secrets and API keys
6. **Log configuration summary** at startup for debugging

## Troubleshooting

### Common Issues

1. **Configuration not initialized**: Call `configService.initialize()` before using
2. **Validation errors**: Check environment variable values and formats
3. **Missing required values**: Ensure all required environment variables are set
4. **Type errors**: Use the provided TypeScript interfaces for type safety

### Debug Mode

Enable debug mode to see detailed configuration information:

```bash
SCRAPER_DEBUG=1 npm start
```

This will show:

- Configuration validation results
- Loaded configuration values
- Environment variable parsing
- Validation warnings and errors
