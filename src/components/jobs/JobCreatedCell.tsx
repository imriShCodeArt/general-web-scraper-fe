import { ScrapingJob } from '@/types';
import { formatDate, formatRelativeTime } from '@/utils';

type Props = {
  job: ScrapingJob;
};

export default function JobCreatedCell({ job }: Props) {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{formatDate(job.createdAt)}</div>
      <div className="text-xs text-gray-500">{formatRelativeTime(job.createdAt)}</div>
    </td>
  );
}


