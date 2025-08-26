// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '60000'),
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Web Scraper Frontend',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  POLLING_INTERVAL: 5000, // 5 seconds
  JOB_POLLING_INTERVAL: 2000, // 2 seconds for running jobs
} as const;

// Job Statuses
export const JOB_STATUSES = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Default Job Options
export const DEFAULT_JOB_OPTIONS = {
  maxProducts: 100,
  delay: 200,
  timeout: 30000,
  maxConcurrent: 5,
  batchSize: 10,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  URL_REGEX: /^https?:\/\/.+/,
  MIN_PRODUCTS: 1,
  MAX_PRODUCTS: 10000,
  MIN_DELAY: 0,
  MAX_DELAY: 10000,
  MIN_TIMEOUT: 5000,
  MAX_TIMEOUT: 120000,
  MIN_CONCURRENT: 1,
  MAX_CONCURRENT: 20,
  MIN_BATCH_SIZE: 1,
  MAX_BATCH_SIZE: 50,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  ANIMATION_DURATION: 200,
} as const;
