import { Play } from 'lucide-react';

type Props = {
  onNewJob: () => void;
};

export default function JobsHeader({ onNewJob }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your web scraping jobs</p>
      </div>
      <button onClick={onNewJob} className="btn-primary flex items-center space-x-2">
        <Play className="w-4 h-4" />
        <span>New Job</span>
      </button>
    </div>
  );
}


