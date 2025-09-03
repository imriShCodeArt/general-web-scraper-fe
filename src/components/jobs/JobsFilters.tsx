import { Search, RefreshCw } from 'lucide-react';
import { cn } from '@/utils';

export type JobStatus = 'all' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

type StatusOption = { value: JobStatus; label: string; color: string };

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: JobStatus;
  onStatusChange: (value: JobStatus) => void;
  statusOptions: StatusOption[];
  onRefresh: () => void;
  refreshing: boolean;
  getStatusCount: (status: JobStatus) => number;
};

export default function JobsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  onRefresh,
  refreshing,
  getStatusCount,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            type="button"
            className={cn(
              'card cursor-pointer transition-all hover:shadow-md text-left',
              statusFilter === status.value && 'ring-2 ring-primary-500'
            )}
            onClick={() => onStatusChange(status.value)}
          >
            <div className="text-center">
              <div className={cn('text-2xl font-bold', status.color)}>{getStatusCount(status.value)}</div>
              <div className="text-sm text-gray-600">{status.label}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={onRefresh} disabled={refreshing} className="btn-secondary flex items-center space-x-2">
            <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}


