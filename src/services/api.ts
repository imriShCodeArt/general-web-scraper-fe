import axios from 'axios';
import {
  RecipeConfig,
  ScrapingJob,
  NewScrapingJobForm,
  ApiResponse,
  RecipeListResponse,
  RecipeResponse,
  ScrapingJobResponse,
  ScrapingJobsResponse,
  StorageStatsResponse,
  LivePerformanceResponse,
  PerformanceRecommendationsResponse,
  OverallPerformanceResponse,
} from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // Increased timeout for scraping operations
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration for better reliability
  validateStatus: (status) => status < 500, // Don't retry on client errors
});

// Add request interceptor for performance monitoring
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for performance tracking
    (config as any).metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and performance monitoring
api.interceptors.response.use(
  (response) => {
    // Calculate request duration for performance monitoring
    if ((response.config as any).metadata?.startTime) {
      const duration = new Date().getTime() - (response.config as any).metadata.startTime.getTime();
      // Intentionally mute slow-request logs in production
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Intentionally mute timeout warnings in production
    
    return Promise.reject(error);
  }
);

// Recipe API endpoints
export const recipeApi = {
  // List all recipes
  list: async (): Promise<RecipeConfig[]> => {
    const response = await api.get<RecipeListResponse>('/recipes/all');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch recipes');
  },

  // Get recipe by name
  get: async (name: string): Promise<RecipeConfig> => {
    const response = await api.get<RecipeResponse>(`/recipes/get/${encodeURIComponent(name)}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch recipe');
  },

  // Get recipe by site URL
  getBySite: async (siteUrl: string): Promise<RecipeConfig> => {
    const response = await api.get<RecipeResponse>('/recipes/getBySite', {
      params: { siteUrl },
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch recipe for site');
  },

  // Validate recipe
  validate: async (name: string): Promise<boolean> => {
    const response = await api.post<ApiResponse<{ isValid: boolean }>>('/recipes/validate', {
      recipeName: name,
    });
    if (response.data.success && response.data.data) {
      return response.data.data.isValid;
    }
    throw new Error(response.data.error || 'Failed to validate recipe');
  },

  // Load recipe from file
  loadFromFile: async (filePath: string): Promise<RecipeConfig> => {
    const response = await api.post<RecipeResponse>('/recipes/loadFromFile', {
      filePath,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to load recipe from file');
  },
};

// Scraping API endpoints
export const scrapingApi = {
  // Start new scraping job
  init: async (data: NewScrapingJobForm): Promise<ScrapingJob> => {
    const response = await api.post<ScrapingJobResponse>('/scrape/init', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to start scraping job');
  },

  // Get job status
  getStatus: async (jobId: string): Promise<ScrapingJob> => {
    const response = await api.get<ScrapingJobResponse>(`/scrape/status/${jobId}`, { params: { _ts: Date.now() } });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get job status');
  },

  // Get all jobs
  getAllJobs: async (): Promise<ScrapingJob[]> => {
    const response = await api.get<ScrapingJobsResponse>('/scrape/jobs', { params: { _ts: Date.now() } });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get jobs');
  },

  // Cancel job
  cancel: async (jobId: string): Promise<boolean> => {
    const response = await api.post<ApiResponse>(`/scrape/cancel/${jobId}`);
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.error || 'Failed to cancel job');
  },

  // Download CSV file
  downloadCsv: async (jobId: string, type: 'parent' | 'variation'): Promise<void> => {
    const response = await api.get(`/scrape/download/${jobId}/${type}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Storage API endpoints
export const storageApi = {
  // Get storage statistics
  getStats: async () => {
    const response = await api.get<StorageStatsResponse>('/storage/stats');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get storage stats');
  },

  // Get job result from storage
  getJobResult: async (jobId: string) => {
    const response = await api.get(`/storage/job/${jobId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get job result');
  },

  // Clear all storage
  clear: async (): Promise<boolean> => {
    const response = await api.delete<ApiResponse>('/storage/clear');
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.error || 'Failed to clear storage');
  },
};

// Performance monitoring API endpoints
export const performanceApi = {
  // Get live performance metrics
  getLiveMetrics: async () => {
    const response = await api.get<LivePerformanceResponse>('/scrape/performance/live');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch live performance metrics');
  },

  // Get performance recommendations
  getRecommendations: async () => {
    const response = await api.get<PerformanceRecommendationsResponse>('/scrape/performance/recommendations');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch performance recommendations');
  },

  // Get overall performance metrics
  getOverallMetrics: async () => {
    const response = await api.get<OverallPerformanceResponse>('/scrape/performance');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch overall performance metrics');
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
