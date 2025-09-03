import axios from 'axios';
import {
  RecipeConfig,
  ScrapingJob,
  NewScrapingJobForm,
  ApiResponse,
  RecipeListResponse,
  RecipeResponse,
  ScrapingJobResponse,
  ScrapingJobInitResponse,
  ScrapingJobsResponse,
  StorageStatsResponse,
  LivePerformanceResponse,
  PerformanceRecommendationsResponse,
  OverallPerformanceResponse,
} from '@/types';

// Create axios instance with base configuration
// Use localhost which should resolve to the correct IP version
const apiBaseURL = 'http://localhost:3000/api';
console.log('API Base URL:', apiBaseURL);

const api = axios.create({
  baseURL: apiBaseURL,
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
      // Intentionally mute slow-request logs in production
    }
    return response;
  },
  (error) => {
    // Enhanced error handling for standardized responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.success === false && errorData.error) {
        // Use the standardized error message from backend
        error.message = errorData.error;
        if (errorData.message) {
          error.message += `: ${errorData.message}`;
        }
      }
    }
    
    // Enhanced error logging for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Provide more specific error messages for common issues
    if (error.response?.status === 500) {
      error.message = 'Server error occurred. Please check if the backend server is running properly and try again.';
    } else if (error.response?.status === 404) {
      error.message = 'The requested resource was not found.';
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to the server. Please ensure the backend is running on the correct port.';
    }
    
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
    // Backend recently changed; support multiple shapes and fallbacks
    try {
      // First try legacy body { recipeName }
      const res1 = await api.post('/recipes/validate', { recipeName: name });
      const d1 = res1.data;
      if (res1.status === 200 || res1.status === 201) {
        if (typeof d1?.success === 'boolean') {
          if (d1.success && d1.data && typeof d1.data.isValid === 'boolean') return d1.data.isValid;
          if (!d1.success) return false;
        }
        if (typeof d1?.isValid === 'boolean') return d1.isValid;
        return true; // 200 without explicit body implies OK
      }
      if (res1.status === 404) return false;
    } catch (_) {
      // proceed to next strategy
    }

    try {
      // Try alternative body { recipe }
      const res2 = await api.post('/recipes/validate', { recipe: name });
      const d2 = res2.data;
      if (res2.status === 200 || res2.status === 201) {
        if (typeof d2?.success === 'boolean') {
          if (d2.success && d2.data && typeof d2.data.isValid === 'boolean') return d2.data.isValid;
          if (!d2.success) return false;
        }
        if (typeof d2?.isValid === 'boolean') return d2.isValid;
        return true;
      }
      if (res2.status === 404) return false;
    } catch (_) {
      // proceed to next strategy
    }

    try {
      // Fallback: if validate shape unknown, consider recipe existence
      const res3 = await api.get(`/recipes/get/${encodeURIComponent(name)}`);
      if (res3.status === 200) return true;
      if (res3.status === 404) return false;
    } catch (_) {
      // swallow and throw generic below
    }

    throw new Error('Failed to validate recipe');
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
    const response = await api.post<ScrapingJobInitResponse>('/scrape/init', data);
    if (response.data.success && response.data.data?.jobId) {
      // The init endpoint only returns jobId, so we need to fetch the full job details
      const jobId = response.data.data.jobId;
      return await scrapingApi.getStatus(jobId);
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
    // Bypass axios instance baseURL ("/api") since backend exposes root "/health"
    const response = await axios.get('/health');
    // Handle both old and new response formats
    if (response.data.success !== undefined) {
      // New standardized format
      return {
        status: response.data.success ? 'ok' : 'error',
        timestamp: response.data.timestamp || new Date().toISOString()
      };
    }
    // Legacy format
    return response.data;
  },
};

export default api;
