import { ScrapingJob } from '@/types';
import { useMemo } from 'react';

type Props = {
  job: ScrapingJob;
};

export default function JobSiteCell({ job }: Props) {
  const siteUrl = useMemo(() => {
    const direct = (job.siteUrl || '').trim();
    if (direct) return direct;
    const meta = (job as any)?.metadata?.siteUrl as string | undefined;
    if (meta && meta.trim()) return meta.trim();
    return '';
  }, [job]);

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="max-w-xs">
        <div className="text-sm font-medium text-gray-900 truncate">
          {siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={siteUrl}
              className="hover:underline"
            >
              {siteUrl}
            </a>
          ) : (
            'No URL'
          )}
        </div>
        <div className="text-sm text-gray-500">ID: {job.id || 'Unknown ID'}</div>
      </div>
    </td>
  );
}


