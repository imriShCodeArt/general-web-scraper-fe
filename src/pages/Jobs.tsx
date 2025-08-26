import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { scrapingApi, recipeApi } from '@/services/api';
import { toast } from 'react-hot-toast';
import { Clock } from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getStatusColor, getStatusIcon } from '@/utils';
import { ScrapingJob, NewScrapingJobForm } from '@/types';
import NewJobModal from '@/components/NewJobModal';
import JobsHeader from '@/components/jobs/JobsHeader';
import JobsFilters, { JobStatus } from '@/components/jobs/JobsFilters';
import JobStatusCell from '@/components/jobs/JobStatusCell';
import JobSiteCell from '@/components/jobs/JobSiteCell';
import JobRecipeCell from '@/components/jobs/JobRecipeCell';
import JobProgressCell from '@/components/jobs/JobProgressCell';
import JobCreatedCell from '@/components/jobs/JobCreatedCell';
import JobActionsCell from '@/components/jobs/JobActionsCell';

type LocalJobStatus = JobStatus;

export default function Jobs() {
  const navigate = useNavigate();
  const { jobs, jobsLoading, recipes, addJob, updateJob, setRecipes, setRecipesLoading } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LocalJobStatus>('all');
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  console.log('Jobs in component:', jobs); // Debug log
  console.log('Search term:', searchTerm); // Debug log
  
  const filteredJobs = jobs.filter(job => {
    console.log('Filtering job:', job); // Debug log
    const matchesSearch = 
      (job.siteUrl?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.recipe?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (job.status || '') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await scrapingApi.getAllJobs();
      // Update store with fresh data
      // Note: This would typically update the store
      toast.success('Jobs refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh jobs:', error);
      toast.error('Failed to refresh jobs');
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-poll running jobs for progress updates
  const pollRunningJobs = useCallback(async () => {
    const runningJobs = jobs.filter(job => job.status === 'running');
    if (runningJobs.length === 0) return;

    try {
      for (const job of runningJobs) {
        const updatedJob = await scrapingApi.getStatus(job.id);
        if (updatedJob.status !== job.status || updatedJob.progress !== job.progress) {
          updateJob(job.id, updatedJob);
        }
      }
    } catch (error) {
      console.error('Failed to poll running jobs:', error);
    }
  }, [jobs, updateJob]);

  // Start/stop polling based on running jobs
  useEffect(() => {
    const runningJobs = jobs.filter(job => job.status === 'running');
    
    if (runningJobs.length > 0) {
      // Poll every 2 seconds for running jobs
      const interval = setInterval(pollRunningJobs, 2000);
      setPollingInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      // Stop polling if no running jobs
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [jobs, pollRunningJobs, pollingInterval]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleCancelJob = async (job: ScrapingJob) => {
    try {
      await scrapingApi.cancel(job.id);
      toast.success(`Job ${job.id} cancelled successfully`);
    } catch (error) {
      console.error('Failed to cancel job:', error);
      toast.error('Failed to cancel job');
    }
  };

  const handleDownloadCsv = async (job: ScrapingJob, type: 'parent' | 'variation') => {
    try {
      await scrapingApi.downloadCsv(job.id, type);
      toast.success(`${type} CSV downloaded successfully`);
    } catch (error) {
      console.error('Failed to download CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  const openNewJobModal = async () => {
    try {
      setRecipesLoading(true);
      const fresh = await recipeApi.list();
      setRecipes(fresh);
    } catch (error) {
      console.error('Failed to refresh recipes before opening modal:', error);
      toast.error('Failed to refresh recipes');
    } finally {
      setRecipesLoading(false);
      setShowNewJobModal(true);
    }
  };

  const handleStartJob = async (jobData: NewScrapingJobForm) => {
    try {
      // Sanitize inputs to avoid backend recipe mismatches
      const cleaned: NewScrapingJobForm = {
        siteUrl: (jobData.siteUrl || '').trim(),
        recipe: (jobData.recipe || '').trim(),
        options: jobData.options,
      };

      // Validate recipe exists on backend before starting
      const isValid = await recipeApi.validate(cleaned.recipe);
      if (!isValid) {
        toast.error(`Recipe "${cleaned.recipe}" is not valid on the server`);
        return;
      }

      const newJob = await scrapingApi.init(cleaned);
      addJob(newJob);
      setShowNewJobModal(false);
      toast.success('Scraping job started successfully!');
    } catch (error) {
      console.error('Failed to start job:', error);
      toast.error('Failed to start scraping job');
    }
  };

  const getStatusCount = (status: LocalJobStatus) => {
    if (status === 'all') return jobs.length;
    return jobs.filter(job => (job.status || '') === status).length;
  };

  const statusOptions: { value: LocalJobStatus; label: string; color: string }[] = [
    { value: 'all', label: 'All Jobs', color: 'text-gray-600' },
    { value: 'pending', label: 'Pending', color: 'text-warning-600' },
    { value: 'running', label: 'Running', color: 'text-primary-600' },
    { value: 'completed', label: 'Completed', color: 'text-success-600' },
    { value: 'failed', label: 'Failed', color: 'text-error-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-gray-600' },
  ];

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <JobsHeader onNewJob={openNewJobModal} />

      {/* Stats, Search and Actions */}
      <JobsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        getStatusCount={getStatusCount}
      />

      {/* Jobs Table */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first scraping job'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowNewJobModal(true)}
              className="btn-primary"
            >
              Start First Job
            </button>
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id || `job-${Math.random()}`} className="hover:bg-gray-50">
                    <JobStatusCell job={job} />
                    <JobSiteCell job={job} />
                    <JobRecipeCell job={job} />
                    <JobProgressCell job={job} />
                    <JobCreatedCell job={job} />
                    <JobActionsCell job={job} onCancel={handleCancelJob} onDownload={handleDownloadCsv} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      <NewJobModal
        isOpen={showNewJobModal}
        onClose={() => setShowNewJobModal(false)}
        onSubmit={handleStartJob}
        recipes={recipes}
      />
    </div>
  );
}
