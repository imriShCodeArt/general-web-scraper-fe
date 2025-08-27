import { ScrapingJob } from '@/types';

type Props = {
  job: ScrapingJob;
};

export default function JobProgressCell({ job }: Props) {
  // Calculate progress percentage
  let progressPercentage = 0;
  
  if (job.progress !== undefined && job.progress !== null) {
    // Use the progress field if available (convert from decimal 0.0-1.0 to percentage 0-100)
    progressPercentage = Math.max(0, Math.min(100, job.progress * 100));
  } else if (job.processedProducts !== undefined && job.totalProducts !== undefined && job.totalProducts > 0) {
    // Fallback: calculate progress from processed vs total products
    progressPercentage = Math.max(0, Math.min(100, (job.processedProducts / job.totalProducts) * 100));
  } else if (job.status === 'completed') {
    // If job is completed but no progress data, show 100%
    progressPercentage = 100;
  } else if (job.status === 'failed' || job.status === 'cancelled') {
    // If job failed or was cancelled, show 0%
    progressPercentage = 0;
  }
  
  // Ensure the percentage is a valid number
  progressPercentage = Math.max(0, Math.min(100, progressPercentage));
  
  // Debug logging to see what's happening with progress
  console.log('JobProgressCell render:', {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    progressPercentage,
    processedProducts: job.processedProducts,
    totalProducts: job.totalProducts,
    hasProgress: job.progress !== undefined && job.progress !== null,
    progressType: typeof job.progress
  });
  
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
      </div>
      {job.processedProducts !== undefined && job.totalProducts !== undefined && (
        <div className="text-xs text-gray-500 mt-1">
          {Math.min(job.processedProducts, job.totalProducts)} / {job.totalProducts} products
        </div>
      )}
      {job.status === 'running' && job.processedProducts && job.totalProducts && (
        <div className="text-xs text-primary-600 mt-1">
          {job.options?.maxConcurrent && job.options.maxConcurrent > 1 && (
            <span className="mr-2">⚡ {job.options.maxConcurrent}x concurrent</span>
          )}
          {job.options?.batchSize && job.options.batchSize > 1 && (
            <span>📦 {job.options.batchSize} batch size</span>
          )}
        </div>
      )}
    </td>
  );
}


