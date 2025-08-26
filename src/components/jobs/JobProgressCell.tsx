import { ScrapingJob } from '@/types';

type Props = {
  job: ScrapingJob;
};

export default function JobProgressCell({ job }: Props) {
  const clamped = Math.max(0, Math.min(100, job.progress || 0));
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${clamped}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{clamped}%</span>
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


