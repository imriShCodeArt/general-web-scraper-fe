// Recipe types
export interface RecipeConfig {
  name: string;
  description?: string;
  version: string;
  siteUrl: string;
  selectors: {
    title: string | string[];
    price: string | string[];
    images: string | string[];
    stock?: string | string[];
    attributes?: string | string[];
    variations?: string | string[];
    description?: string | string[];
    sku?: string | string[];
  };
  transforms?: {
    title?: string[];
    price?: string[];
    description?: string[];
    [key: string]: string[] | undefined;
  };
  fallbacks?: {
    title?: string[];
    price?: string[];
    [key: string]: string[] | undefined;
  };
  behavior?: {
    waitForSelectors?: string[];
    rateLimit?: number;
    maxConcurrent?: number;
    timeout?: number;
  };
}

export interface RecipeFile {
  recipes: RecipeConfig[];
}

// Scraping job types
export interface ScrapingJob {
  id: string;
  siteUrl: string;
  recipe: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalProducts?: number;
  processedProducts?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  startedAt?: string | Date;
  completedAt?: string | Date;
  error?: string;
  options?: {
    maxProducts?: number;
    delay?: number;
    timeout?: number;
    maxConcurrent?: number; // Added for concurrent processing
    batchSize?: number; // Added for batch processing
  };
  metadata?: {
    [key: string]: any;
  };
}

export interface ScrapingJobResult {
  jobId: string;
  metadata: {
    filename: string;
    totalProducts: number;
    totalVariations: number;
    siteUrl: string;
    recipe: string;
    createdAt: string | Date;
  };
  parentCsv: string;
  variationCsv: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RecipeListResponse extends ApiResponse<RecipeConfig[]> {}
export interface RecipeResponse extends ApiResponse<RecipeConfig> {}
export interface ScrapingJobResponse extends ApiResponse<ScrapingJob> {}
export interface ScrapingJobsResponse extends ApiResponse<ScrapingJob[]> {}
export interface StorageStatsResponse extends ApiResponse<{
  totalJobs: number;
  totalStorage: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
}> {}

// Form types
export interface NewScrapingJobForm {
  siteUrl: string;
  recipe: string;
  options?: {
    maxProducts?: number;
    delay?: number;
    timeout?: number;
    maxConcurrent?: number; // Added for concurrent processing
    batchSize?: number; // Added for batch processing
  };
}

export interface RecipeForm {
  name: string;
  description: string;
  siteUrl: string;
  selectors: {
    title: string;
    price: string;
    images: string;
    stock?: string;
    attributes?: string;
    variations?: string;
    description?: string;
    sku?: string;
  };
  transforms?: {
    title?: string;
    price?: string;
    description?: string;
  };
}

// Performance monitoring types
export interface LivePerformanceMetrics {
  timestamp: number;
  activeJobs: ActiveJob[];
  queueLength: number;
  isProcessing: boolean;
  systemLoad: SystemLoad;
}

export interface ActiveJob {
  id: string;
  status: string;
  progress: number;
  duration: number;
  productsPerSecond: string;
}

export interface SystemLoad {
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  cpuUsage: {
    user: number;
    system: number;
  };
  uptime: number;
}

export interface PerformanceRecommendation {
  type: 'performance' | 'concurrency' | 'optimization' | 'resource';
  priority: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
}

export interface PerformanceRecommendations {
  recommendations: PerformanceRecommendation[];
  currentSettings: {
    defaultMaxConcurrent: number;
    defaultRateLimit: number;
    fastModeAvailable: boolean;
  };
}

export interface OverallPerformanceMetrics {
  totalJobs: number;
  totalProducts: number;
  averageTimePerProduct: number;
  totalProcessingTime: number;
  activeJobs: number;
  queuedJobs: number;
  isProcessing: boolean;
}

export interface LivePerformanceResponse extends ApiResponse<LivePerformanceMetrics> {}
export interface PerformanceRecommendationsResponse extends ApiResponse<PerformanceRecommendations> {}
export interface OverallPerformanceResponse extends ApiResponse<OverallPerformanceMetrics> {}
