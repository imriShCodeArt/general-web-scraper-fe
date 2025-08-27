import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Unknown date';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
}

// Format relative time
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return 'Unknown time';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid time';
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Invalid time';
  }
}

// Get status color for badges
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'running':
      return 'badge-info';
    case 'pending':
      return 'badge-warning';
    case 'failed':
    case 'cancelled':
      return 'badge-error';
    default:
      return 'badge-info';
  }
}

// Get status icon
export function getStatusIcon(status: string): string {
  switch (status) {
    case 'completed':
      return '✓';
    case 'running':
      return '⟳';
    case 'pending':
      return '⏳';
    case 'failed':
      return '✗';
    case 'cancelled':
      return '⊘';
    default:
      return '?';
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Validate URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Parse recipe selectors for display
export function parseSelectors(selectors: string | string[]): string[] {
  if (Array.isArray(selectors)) {
    return selectors;
  }
  return selectors.split(',').map(s => s.trim());
}

// Format selector for display
export function formatSelector(selector: string): string {
  return selector.replace(/[<>]/g, '&lt;').replace(/[>]/g, '&gt;');
}

// Performance monitoring utilities
export const calculateScrapingEfficiency = (
  processedProducts: number,
  totalProducts: number,
  startTime: Date,
  endTime?: Date
) => {
  const end = endTime || new Date();
  const duration = end.getTime() - startTime.getTime();
  const productsPerSecond = processedProducts / (duration / 1000);
  const estimatedTimeRemaining = totalProducts > processedProducts 
    ? (totalProducts - processedProducts) / productsPerSecond 
    : 0;
  
  return {
    productsPerSecond: Math.round(productsPerSecond * 100) / 100,
    estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
    efficiency: Math.round((processedProducts / totalProducts) * 100),
    duration: Math.round(duration / 1000),
  };
};

export const getPerformanceRecommendations = (job: any) => {
  const recommendations = [];
  
  if (job.options?.delay && job.options.delay > 500) {
    recommendations.push('Consider reducing delay to 200-300ms for faster processing');
  }
  
  if (!job.options?.maxConcurrent || job.options.maxConcurrent === 1) {
    recommendations.push('Enable concurrent processing (5-10 requests) for better performance');
  }
  
  if (!job.options?.batchSize || job.options.batchSize === 1) {
    recommendations.push('Use batch processing (10-20 products) for improved efficiency');
  }
  
  if (job.options?.timeout && job.options.timeout < 30000) {
    recommendations.push('Increase timeout to 60s for complex pages');
  }
  
  return recommendations;
};

export const formatPerformanceMetrics = (efficiency: any) => {
  return {
    speed: `${efficiency.productsPerSecond} products/sec`,
    eta: efficiency.estimatedTimeRemaining > 0 
      ? `${Math.round(efficiency.estimatedTimeRemaining / 60)} min remaining`
      : 'Complete',
    efficiency: `${efficiency.efficiency}% complete`,
  };
};
