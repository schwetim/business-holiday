/**
 * API Service - Single source of truth for all API requests
 * Uses Next.js API routes to proxy requests in development
 * Includes retry logic for handling temporary connection issues
 */

// Maximum number of retries for API requests
const MAX_RETRIES = 3;
// Delay between retries (increases with each retry)
const BASE_RETRY_DELAY = 1000; // ms

// Determine environment-specific base URL
const getBaseUrl = (useDirectBackend: boolean = false): string => {
  // In production (Vercel), use the environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  // In development, use direct backend URL for health checks
  if (useDirectBackend) {
    return process.env.BACKEND_URL || 'http://backend:5000';
  }
  
  // In development, use relative path (Next.js API routing) for other requests
  return '';
};

/**
 * Fetch with retry functionality
 * Attempts to fetch data multiple times with exponential backoff
 */
const fetchWithRetry = async (
  url: string, 
  options?: RequestInit, 
  retries = MAX_RETRIES, 
  delay = BASE_RETRY_DELAY
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    
    // Only retry on connection errors or 5xx server errors
    if (response.status >= 500 && retries > 0) {
      console.log(`API request failed with status ${response.status}, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 1.5);
    }
    
    return response;
  } catch (error) {
    // Network errors (ECONNREFUSED, etc)
    if (retries > 0) {
      console.log(`API connection error, retrying... (${retries} attempts left):`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 1.5);
    }
    throw error;
  }
};

// Unified API error handler
const handleApiError = (error: unknown, endpoint: string) => {
  console.error(`API Error (${endpoint}):`, error);
  throw new Error(`Failed to fetch data from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
};

// Check if backend is alive
const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // Use direct backend URL for health checks to avoid routing loop
    const response = await fetchWithRetry(`${getBaseUrl(true)}/api/health`);
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

// API endpoints
export const api = {
  /**
   * Check if the backend is ready
   */
  isBackendReady: async (): Promise<boolean> => {
    return await checkBackendHealth();
  },

  /**
   * Get list of industries with retry logic
   */
  getIndustries: async (): Promise<string[]> => {
    try {
      const response = await fetchWithRetry(`${getBaseUrl()}/api/events/industries`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'industries');
    }
  },
  
  /**
   * Get events filtered by criteria with retry logic
   */
  getEvents: async (params: { 
    industry: string, 
    region?: string,
    startDate?: string,
    endDate?: string 
  }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add only non-empty parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await fetchWithRetry(`${getBaseUrl()}/api/events?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'events');
    }
  }
};
