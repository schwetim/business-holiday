import React, { useEffect, useState, useCallback } from 'react';
import SelectField from './SelectField';
import { api } from '../services/api';

interface IndustrySelectProps {
  value: string;
  onChange: (value: string) => void;
  industries?: string[];
  onIndustriesLoaded?: (industries: string[]) => void;
}

const IndustrySelect: React.FC<IndustrySelectProps> = ({ 
  value, 
  onChange,
  industries: externalIndustries,
  onIndustriesLoaded
}) => {
  const [industries, setIndustries] = useState<string[]>(externalIndustries || []);
  const [loading, setLoading] = useState(!externalIndustries);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [backendAvailable, setBackendAvailable] = useState(true);
  
  // Maximum retries for component-level retry
  const MAX_COMPONENT_RETRIES = 5;
  
  // Function to handle manual retry from the user
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };
  
  /**
   * Main fetch function with component-level retry logic
   */
  const fetchIndustries = useCallback(async () => {
    // Skip API call if industries were provided by parent component
    if (externalIndustries && externalIndustries.length > 0) {
      setIndustries(externalIndustries);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // First try checking the backend health if we previously had an issue
      if (!backendAvailable) {
        const isReady = await api.isBackendReady();
        if (!isReady) {
          throw new Error('Backend service not yet available');
        }
        
        // If we get here, backend became available
        setBackendAvailable(true);
      }
      
      console.log('IndustrySelect: Fetching industries');
      const data = await api.getIndustries();
      console.log('IndustrySelect: Received industries', data);
      
      if (!Array.isArray(data)) {
        console.error('IndustrySelect: Received non-array data:', data);
        throw new Error('Received invalid data format from API');
      }
      
      setIndustries(data);
      
      // Notify parent component if callback provided
      if (onIndustriesLoaded) {
        onIndustriesLoaded(data);
      }
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (err) {
      console.error('IndustrySelect: Error fetching industries:', err);
      
      // Detect if backend is unavailable
      if (err instanceof Error && 
          (err.message.includes('ECONNREFUSED') || 
           err.message.includes('Failed to fetch') ||
           err.message.includes('not yet available'))) {
        setBackendAvailable(false);
      }
      
      setError(err instanceof Error ? err.message : 'Failed to load industries');
      
      // Don't exceed max retries
      if (retryCount < MAX_COMPONENT_RETRIES) {
        // Set up automatic retry with exponential backoff
        const retryDelay = Math.min(1000 * Math.pow(1.5, retryCount), 10000);
        console.log(`IndustrySelect: Will retry in ${retryDelay}ms (attempt ${retryCount + 1})`);
        
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
        
        return () => clearTimeout(timer);
      }
    } finally {
      setLoading(false);
    }
  }, [externalIndustries, onIndustriesLoaded, retryCount, backendAvailable]);

  // Trigger fetch whenever retryCount changes
  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries, retryCount]);

  // Add debugging output to help troubleshoot
  console.log('IndustrySelect render:', { 
    industries, 
    loading, 
    error, 
    retryCount,
    backendAvailable,
    hasExternalIndustries: Boolean(externalIndustries && externalIndustries.length > 0)
  });

  return (
    <div>
      <SelectField
        id="industry"
        label="Industry"
        value={value}
        options={industries.map((i) => ({ label: i, value: i }))}
        onChange={onChange}
        disabled={loading}
        error={error || undefined}
        placeholder="Select an industry"
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading industries</p>}
      {error && (
        <div className="mt-2">
          <p className="text-sm text-red-500">{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-1 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
          >
            Retry
          </button>
          {!backendAvailable && (
            <p className="text-xs text-gray-500 mt-1">
              The backend service might still be starting up. We'll keep trying.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default IndustrySelect;
