import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Play, Settings } from 'lucide-react';
import { RecipeConfig, NewScrapingJobForm } from '@/types';
import { cn, isValidUrl } from '@/utils';
import { Button, FormField } from '@/components/ui';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewScrapingJobForm) => void;
  recipes: RecipeConfig[];
}

export default function NewJobModal({ isOpen, onClose, onSubmit, recipes }: NewJobModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<NewScrapingJobForm>({
    defaultValues: {
      siteUrl: '',
      recipe: '',
      options: {
        maxProducts: 100,
        delay: 200, // Reduced from 1000ms to 200ms for better performance
        timeout: 30000,
        maxConcurrent: 5, // Added concurrent processing
        batchSize: 10, // Added batch processing
      },
    },
  });

  const selectedRecipe = watch('recipe');
  const recipe = recipes.find(r => r.name === selectedRecipe);

  const handleFormSubmit = (data: NewScrapingJobForm) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClose();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Play className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Start New Scraping Job</h3>
                <p className="text-sm text-gray-500">Configure and start a new web scraping operation</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
            {/* Basic Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Basic Configuration</h4>
              
              {/* Site URL */}
              <FormField
                label="Site URL"
                required
                error={errors.siteUrl?.message}
              >
                <input
                  {...register('siteUrl', {
                    required: 'Site URL is required',
                    validate: (value) => isValidUrl(value) || 'Please enter a valid URL',
                  })}
                  type="url"
                  id="siteUrl"
                  placeholder="https://example.com"
                  className={cn(
                    "input",
                    errors.siteUrl ? "border-error-500 focus:ring-error-500" : ""
                  )}
                />
              </FormField>

              {/* Recipe Selection */}
              <FormField
                label="Recipe"
                required
                error={errors.recipe?.message}
              >
                <select
                  {...register('recipe', { required: 'Recipe is required' })}
                  id="recipe"
                  className={cn(
                    "input",
                    errors.recipe ? "border-error-500 focus:ring-error-500" : ""
                  )}
                >
                  <option value="">Select a recipe...</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.name} value={recipe.name}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
                
                {/* Recipe Info */}
                {recipe && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span> {recipe.description || 'No description'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Version:</span> {recipe.version}
                    </p>
                  </div>
                )}
              </FormField>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Advanced Options</span>
                <span className={cn(
                  "ml-auto transition-transform",
                  showAdvanced ? "rotate-180" : ""
                )}>
                  ▼
                </span>
              </button>

              {showAdvanced && (
                <div className="pl-4 space-y-4 border-l-2 border-gray-200">
                  {/* Max Products */}
                  <div>
                    <label htmlFor="maxProducts" className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Products
                    </label>
                    <input
                      {...register('options.maxProducts', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Must be at least 1' },
                        max: { value: 10000, message: 'Must be at most 10,000' },
                      })}
                      type="number"
                      id="maxProducts"
                      min="1"
                      max="10000"
                      className="input"
                    />
                    {errors.options?.maxProducts && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.options.maxProducts.message}
                      </p>
                    )}
                  </div>

                  {/* Delay */}
                  <div>
                    <label htmlFor="delay" className="block text-sm font-medium text-gray-700 mb-2">
                      Delay Between Requests (ms)
                    </label>
                    <input
                      {...register('options.delay', {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be at least 0' },
                        max: { value: 10000, message: 'Must be at most 10,000' },
                      })}
                      type="number"
                      id="delay"
                      min="0"
                      max="10000"
                      step="100"
                      className="input"
                    />
                    {errors.options?.delay && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.options.delay.message}
                      </p>
                    )}
                  </div>

                  {/* Timeout */}
                  <div>
                    <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-2">
                      Request Timeout (ms)
                    </label>
                    <input
                      {...register('options.timeout', {
                        valueAsNumber: true,
                        min: { value: 5000, message: 'Must be at least 5,000' },
                        max: { value: 120000, message: 'Must be at most 120,000' },
                      })}
                      type="number"
                      id="timeout"
                      min="5000"
                      max="120000"
                      step="1000"
                      className="input"
                    />
                    {errors.options?.timeout && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.options.timeout.message}
                      </p>
                    )}
                  </div>

                  {/* Max Concurrent Requests */}
                  <div>
                    <label htmlFor="maxConcurrent" className="block text-sm font-medium text-gray-700 mb-2">
                      Max Concurrent Requests
                    </label>
                    <input
                      {...register('options.maxConcurrent', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Must be at least 1' },
                        max: { value: 20, message: 'Must be at most 20' },
                      })}
                      type="number"
                      id="maxConcurrent"
                      min="1"
                      max="20"
                      className="input"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Higher values increase speed but may trigger rate limiting
                    </p>
                    {errors.options?.maxConcurrent && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.options.maxConcurrent.message}
                      </p>
                    )}
                  </div>

                  {/* Batch Size */}
                  <div>
                    <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Size
                    </label>
                    <input
                      {...register('options.batchSize', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Must be at least 1' },
                        max: { value: 50, message: 'Must be at most 50' },
                      })}
                      type="number"
                      id="batchSize"
                      min="1"
                      max="50"
                      className="input"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Process multiple products in batches for better efficiency
                    </p>
                    {errors.options?.batchSize && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.options.batchSize.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
              >
                {!isSubmitting && (
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Job</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
