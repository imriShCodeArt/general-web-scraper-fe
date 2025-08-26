import { ScrapingJob } from '@/types';
import { useAppStore } from '@/store';
import { useMemo } from 'react';

type Props = {
  job: ScrapingJob;
};

export default function JobRecipeCell({ job }: Props) {
  const { recipes } = useAppStore();

  const displayName = useMemo(() => {
    const direct = (job.recipe || '').trim();
    if (direct) return direct;

    const meta = (job as any)?.metadata?.recipe as string | undefined;
    if (meta && meta.trim()) return meta.trim();

    // Try resolve by site URL match if available
    const siteUrl = (job.siteUrl || '').toLowerCase();
    if (siteUrl && recipes && recipes.length > 0) {
      const byExact = recipes.find(r => (r.siteUrl || '').toLowerCase() === siteUrl);
      if (byExact?.name) return byExact.name;
      const byIncludes = recipes.find(r => siteUrl.includes((r.siteUrl || '').toLowerCase()));
      if (byIncludes?.name) return byIncludes.name;
    }

    return '';
  }, [job, recipes]);

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-sm text-gray-900" title={displayName || job.recipe || ''}>
        {displayName || job.recipe || 'No Recipe'}
      </span>
    </td>
  );
}


