import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store';
import { recipeApi, scrapingApi } from '@/services/api';
import { toast } from 'react-hot-toast';
import { APP_CONFIG } from '@/constants';

// Components
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import Dashboard from '@/pages/Dashboard';
import Recipes from '@/pages/Recipes';
import Jobs from '@/pages/Jobs';
import Storage from '@/pages/Storage';
import RecipeDetail from '@/pages/RecipeDetail';
import JobDetail from '@/pages/JobDetail';
import Performance from '@/pages/Performance';

function App() {
  const { 
    setRecipes, 
    setJobs, 
    setRecipesLoading, 
    setJobsLoading,
    updateJob 
  } = useAppStore();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load recipes
        setRecipesLoading(true);
        const recipes = await recipeApi.list();
        setRecipes(recipes);
      } catch (error) {
        console.error('Failed to load recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setRecipesLoading(false);
      }

      try {
        // Load jobs
        setJobsLoading(true);
        const jobs = await scrapingApi.getAllJobs();
        setJobs(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setJobsLoading(false);
      }
    };

    loadInitialData();
  }, [setRecipes, setJobs, setRecipesLoading, setJobsLoading]);

  // Selective polling for active jobs (running/pending) without flooding the server
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { jobs, setJobs } = useAppStore.getState();
        const hasActive = jobs.some(j => !['completed', 'failed', 'cancelled'].includes(j.status));
        if (!hasActive) return;

        const latestJobs = await scrapingApi.getAllJobs();
        setJobs(latestJobs);
      } catch (error) {
        console.error('Failed selective polling tick:', error);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:name" element={<RecipeDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
