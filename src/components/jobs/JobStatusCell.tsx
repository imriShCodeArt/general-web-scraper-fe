import { cn, getStatusColor, getStatusIcon } from '@/utils';
import { ScrapingJob } from '@/types';

type Props = {
  job: ScrapingJob;
};

export default function JobStatusCell({ job }: Props) {
  const status = job.status || 'unknown';
  const color = getStatusColor(status);
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <span className={cn('text-lg', color)}>{getStatusIcon(status)}</span>
        <span className={cn('badge', color)}>{status}</span>
      </div>
    </td>
  );
}


