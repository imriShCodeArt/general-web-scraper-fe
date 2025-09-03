import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Activity,
  BarChart3,
  Clock,
  HardDrive,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui';
import LoadingSpinner from '@/components/LoadingSpinner';
import { performanceApi } from '@/services/api';
import { LivePerformanceMetrics } from '@/types';

// Use the standardized type from the types file
type PerformanceMetrics = LivePerformanceMetrics;

export default function Performance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Demo data for when backend is not available
  const demoData = useMemo((): PerformanceMetrics => ({
    timestamp: Date.now(),
    activeJobs: [
      {
        id: "job-demo-1",
        status: "running",
        progress: 0.65,
        duration: 45000,
        productsPerSecond: "2.3"
      },
      {
        id: "job-demo-2", 
        status: "running",
        progress: 0.23,
        duration: 12000,
        productsPerSecond: "1.8"
      }
    ],
    queueLength: 2,
    isProcessing: true,
    systemLoad: {
      memoryUsage: {
        rss: 123456789,
        heapTotal: 987654321,
        heapUsed: 456789123,
        external: 12345678
      },
      cpuUsage: {
        user: 123456789,
        system: 98765432
      },
      uptime: 3600
    }
  }), []);

  const fetchData = useCallback(async () => {
    if (demoMode) {
      // Use demo data
      setMetrics(demoData);
      setLiveMetrics(true);
      setLoading(false);
      return;
    }

    try {
      const data = await performanceApi.getLiveMetrics();
      setMetrics(data);
      setLiveMetrics(true);
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      // Fall back to demo data if API fails
      setMetrics(demoData);
      setLiveMetrics(true);
    } finally {
      setLoading(false);
    }
  }, [demoMode, demoData]);

  useEffect(() => {
    fetchData();
    
    if (isMonitoring && !demoMode) {
      const interval = setInterval(fetchData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring, demoMode, fetchData]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading && !liveMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring and optimization recommendations for your scraping operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setDemoMode(!demoMode)}
            variant={demoMode ? "primary" : "ghost"}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{demoMode ? 'Demo Mode' : 'Demo Mode'}</span>
          </Button>
          <Button
            onClick={toggleMonitoring}
            variant={isMonitoring ? "ghost" : "primary"}
            className="flex items-center space-x-2"
          >
            {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isMonitoring ? 'Pause' : 'Resume'} Monitoring</span>
          </Button>
          <Button
            onClick={fetchData}
            variant="ghost"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {demoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Demo Mode Active</span>
          </div>
          <p className="text-blue-700 mt-1 text-sm">
            Showing sample performance data. Toggle Demo Mode to connect to real backend endpoints.
          </p>
        </div>
      )}

      {/* Live Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Jobs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${metrics.isProcessing ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {metrics.isProcessing ? 'Processing' : 'Idle'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {metrics.activeJobs.length > 0 ? (
                  metrics.activeJobs.map((job) => (
                    <div key={job.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Job {job.id}</span>
                        <span className="text-xs text-gray-500">{formatDuration(job.duration)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.round(job.progress * 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-600">{Math.round(job.progress * 100)}%</span>
                        </div>
                        <span className="text-gray-600">{job.productsPerSecond} products/sec</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No active jobs</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Queue Length:</span>
                  <span className="font-medium">{metrics.queueLength}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Load */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Load</h3>
              
              <div className="space-y-4">
                {/* Memory Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatBytes(metrics.systemLoad.memoryUsage.heapUsed)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(metrics.systemLoad.memoryUsage.heapUsed / metrics.systemLoad.memoryUsage.heapTotal) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Used: {formatBytes(metrics.systemLoad.memoryUsage.heapUsed)}</span>
                    <span>Total: {formatBytes(metrics.systemLoad.memoryUsage.heapTotal)}</span>
                  </div>
                </div>

                {/* CPU Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDuration(metrics.systemLoad.cpuUsage.user + metrics.systemLoad.cpuUsage.system)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>User: {formatDuration(metrics.systemLoad.cpuUsage.user)}</span>
                    <span>System: {formatDuration(metrics.systemLoad.cpuUsage.system)}</span>
                  </div>
                </div>

                {/* Uptime */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">System Uptime</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatUptime(metrics.systemLoad.uptime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
