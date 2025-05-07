/**
 * API Service - Single source of truth for all API requests
 * Uses Next.js API routes to proxy requests in development
 */

import { Accommodation, Event, Flight, IndustryWithCount, SearchResults, CountryWithCount } from '../types'; // Import types

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
   * Get list of industries with event counts
   */
  getIndustriesWithCount: async (): Promise<IndustryWithCount[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/events/industries-with-count`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error, 'industries-with-count');
    }
  },

  /**
   * Get countries with event counts
   */
  getCountriesWithEventCounts: async (): Promise<CountryWithCount[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/events/countries-with-count`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'countries-with-count');
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
  },

  /**
   * Get accommodations filtered by criteria
   */
  getAccommodations: async (params: {
    location: string;
    startDate: string;
    endDate: string;
    // eventId?: string | number; // Optional: if needed later
  }): Promise<Accommodation[]> => { // Use the defined Accommodation type
    try {
      const queryParams = new URLSearchParams();
      
      // Add only non-empty parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value)); // Ensure value is string
      });

      const response = await fetch(`${getBaseUrl()}/api/accommodations?${queryParams}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Ensure Accommodation[] is returned even in error case for type consistency, 
      // although handleApiError throws. Or adjust handleApiError if needed.
      // For now, let handleApiError throw. The caller should catch.
      return handleApiError(error, 'accommodations');
    }
  },

  /**
   * Get a single event by its ID
   */
  getEventById: async (id: string | number): Promise<Event | null> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/events/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Return null if event not found
        }
        throw new Error(`API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error, `event/${id}`);
    }
  },

  /**
   * Get flights filtered by criteria
   */
  getFlights: async (params: {
    origin: string;
    destination: string;
    startDate: string;
    endDate: string;
  }): Promise<Flight[]> => { // Use the defined Flight type
    try {
      const queryParams = new URLSearchParams();

      // Add only non-empty parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value)); // Ensure value is string
      });

      const response = await fetch(`${getBaseUrl()}/api/flights?${queryParams}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error, 'flights');
    }
  },

  /**
   * Perform a global search across events, categories, and tags
   */
  search: async (query: string): Promise<SearchResults> => {
    try {
      const queryParams = new URLSearchParams({ q: query });
      const response = await fetch(`${getBaseUrl()}/api/search?${queryParams}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error, 'search');
    }
  },
};
