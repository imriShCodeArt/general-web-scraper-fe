import { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  HardDrive, 
  Cpu, 
  HardDrive as MemoryIcon,
  Zap,
  BarChart3,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import { performanceApi } from '@/services/api';
import { 
  LivePerformanceMetrics, 
  PerformanceRecommendations, 
  OverallPerformanceMetrics 
} from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Performance() {
  const [liveMetrics, setLiveMetrics] = useState<LivePerformanceMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<PerformanceRecommendations | null>(null);
  const [overallMetrics, setOverallMetrics] = useState<OverallPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Demo data for when backend is not available
  const demoData: {
    liveMetrics: LivePerformanceMetrics;
    recommendations: PerformanceRecommendations;
    overallMetrics: OverallPerformanceMetrics;
  } = {
    liveMetrics: {
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
    },
    recommendations: {
      recommendations: [
        {
          type: "performance" as const,
          priority: "high" as const,
          message: "Average processing time per product is high (>5s). Consider enabling fast mode or reducing concurrent workers.",
          suggestion: "Set fastMode: true in recipe behavior or reduce maxConcurrent to 5-8"
        },
        {
          type: "concurrency" as const,
          priority: "medium" as const, 
          message: "High number of active jobs may impact performance.",
          suggestion: "Consider reducing maxConcurrent in recipe behavior"
        }
      ],
      currentSettings: {
        defaultMaxConcurrent: 10,
        defaultRateLimit: 50,
        fastModeAvailable: true
      }
    },
    overallMetrics: {
      totalJobs: 15,
      totalProducts: 1250,
      averageTimePerProduct: 450,
      totalProcessingTime: 562500,
      activeJobs: 2,
      queuedJobs: 1,
      isProcessing: true
    }
  };

  const fetchData = async () => {
    if (demoMode) {
      // Use demo data
      setLiveMetrics(demoData.liveMetrics);
      setRecommendations(demoData.recommendations);
      setOverallMetrics(demoData.overallMetrics);
      setLastUpdate(new Date());
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [live, recs, overall] = await Promise.all([
        performanceApi.getLiveMetrics(),
        performanceApi.getRecommendations(),
        performanceApi.getOverallMetrics()
      ]);
      
      setLiveMetrics(live);
      setRecommendations(recs);
      setOverallMetrics(overall);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
      // Set loading to false even on error so users can see the error message
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (isMonitoring && !demoMode) {
      const interval = setInterval(fetchData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring, demoMode]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'concurrency': return <Activity className="w-4 h-4" />;
      case 'optimization': return <TrendingUp className="w-4 h-4" />;
      case 'resource': return <HardDrive className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Error loading performance data</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

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

      {lastUpdate && (
        <div className="text-sm text-gray-500 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Live Metrics */}
      {liveMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Jobs */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${liveMetrics.isProcessing ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {liveMetrics.isProcessing ? 'Processing' : 'Idle'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {liveMetrics.activeJobs.length > 0 ? (
                  liveMetrics.activeJobs.map((job) => (
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
                  <span className="font-medium">{liveMetrics.queueLength}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* System Load */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Load</h3>
              
              <div className="space-y-4">
                {/* Memory Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MemoryIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatBytes(liveMetrics.systemLoad.memoryUsage.heapUsed)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(liveMetrics.systemLoad.memoryUsage.heapUsed / liveMetrics.systemLoad.memoryUsage.heapTotal) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Used: {formatBytes(liveMetrics.systemLoad.memoryUsage.heapUsed)}</span>
                    <span>Total: {formatBytes(liveMetrics.systemLoad.memoryUsage.heapTotal)}</span>
                  </div>
                </div>

                {/* CPU Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDuration(liveMetrics.systemLoad.cpuUsage.user + liveMetrics.systemLoad.cpuUsage.system)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>User: {formatDuration(liveMetrics.systemLoad.cpuUsage.user)}</span>
                    <span>System: {formatDuration(liveMetrics.systemLoad.cpuUsage.system)}</span>
                  </div>
                </div>

                {/* Uptime */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">System Uptime</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatUptime(liveMetrics.systemLoad.uptime)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Performance Recommendations */}
      {recommendations && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Recommendations</h3>
            
            {recommendations.recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(rec.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium capitalize">{rec.type}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{rec.message}</p>
                        <p className="text-xs opacity-75">
                          <strong>Suggestion:</strong> {rec.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="text-lg font-medium text-gray-900">All systems running optimally!</p>
                <p className="text-sm">No performance recommendations at this time.</p>
              </div>
            )}

            {/* Current Settings */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Current Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-600">Max Concurrent:</span>
                  <span className="ml-2 font-medium">{recommendations.currentSettings.defaultMaxConcurrent}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-600">Rate Limit:</span>
                  <span className="ml-2 font-medium">{recommendations.currentSettings.defaultRateLimit}ms</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-600">Fast Mode:</span>
                  <span className={`ml-2 font-medium ${recommendations.currentSettings.fastModeAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {recommendations.currentSettings.fastModeAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Overall Performance Metrics */}
      {overallMetrics && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{overallMetrics.totalJobs}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overallMetrics.totalProducts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallMetrics.averageTimePerProduct}ms</div>
                <div className="text-sm text-gray-600">Avg Time/Product</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatDuration(overallMetrics.totalProcessingTime)}</div>
                <div className="text-sm text-gray-600">Total Processing</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-semibold text-gray-900">{overallMetrics.activeJobs}</div>
                  <div className="text-sm text-gray-600">Active Jobs</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-semibold text-gray-900">{overallMetrics.queuedJobs}</div>
                  <div className="text-sm text-gray-600">Queued Jobs</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className={`text-lg font-semibold ${overallMetrics.isProcessing ? 'text-green-600' : 'text-gray-600'}`}>
                    {overallMetrics.isProcessing ? 'Processing' : 'Idle'}
                  </div>
                  <div className="text-sm text-gray-600">System Status</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
