import { ScrapingJob } from '@/types';
import { useMemo, useState, useRef, useEffect } from 'react';

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

  const baseUrl = useMemo(() => {
    if (!siteUrl) return '';
    try {
      const u = new URL(siteUrl);
      return u.origin; // Show base URL (protocol + host)
    } catch {
      // Fallback: try to extract up to first single slash after protocol
      const match = siteUrl.match(/^https?:\/\/[^/]+/i);
      return match ? match[0] : siteUrl;
    }
  }, [siteUrl]);

  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
      }
    };
  }, []);

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="max-w-xs">
        <div
          className="text-sm font-medium text-gray-900 relative"
          onMouseEnter={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
            hoverTimer.current = window.setTimeout(() => {
              setShowTooltip(true);
            }, 1000);
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) {
              window.clearTimeout(hoverTimer.current);
              hoverTimer.current = null;
            }
            setShowTooltip(false);
          }}
        >
          {siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <span className="block truncate max-w-xs">{baseUrl}</span>
            </a>
          ) : (
            'No URL'
          )}
          {showTooltip && siteUrl && (
            <div className="absolute z-10 mt-1 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow left-0 top-full max-w-xs break-all">
              {siteUrl}
            </div>
          )}
        </div>
      </div>
    </td>
  );
}


