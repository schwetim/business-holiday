/**
 * API Service - Single source of truth for all API requests
 * Uses Next.js API routes to proxy requests in development
 */

// Determine environment-specific base URL
const getBaseUrl = (): string => {
  // In production (Vercel), use the environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  // In development, use relative path (Next.js API routing)
  return '';
};

// Unified API error handler
const handleApiError = (error: unknown, endpoint: string) => {
  console.error(`API Error (${endpoint}):`, error);
  throw new Error(`Failed to fetch data from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
};

// API endpoints
export const api = {
  /**
   * Get list of industries
   */
  getIndustries: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/events/industries`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'industries');
    }
  },
  
  /**
   * Get events filtered by criteria
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
      
      const response = await fetch(`${getBaseUrl()}/api/events?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'events');
    }
  }
};
