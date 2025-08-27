import { useNavigate } from 'react-router-dom';
import { Pause, Trash2, Download, Eye } from 'lucide-react';
import { ScrapingJob } from '@/types';

type Props = {
  job: ScrapingJob;
  onCancel: (job: ScrapingJob) => void;
  onDownload: (job: ScrapingJob, type: 'parent' | 'variation') => void;
};

export default function JobActionsCell({ job, onCancel, onDownload }: Props) {
  const navigate = useNavigate();
  const status = job.status || '';
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(`/jobs/${job.id || 'unknown'}`)}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {status === 'running' && (
          <button
            onClick={() => onCancel(job)}
            className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
            title="Cancel Job"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}

        {status === 'completed' && (
          <>
            <button
              onClick={() => onDownload(job, 'parent')}
              className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
              title="Download Parent CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDownload(job, 'variation')}
              className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
              title="Download Variation CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}

        {status === 'failed' && (
          <button
            onClick={() => onCancel(job)}
            className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
            title="Remove Job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </td>
  );
}


