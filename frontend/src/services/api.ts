/**
 * API Service - Single source of truth for all API requests
 * Uses Next.js API routes to proxy requests in development
 */

import { Accommodation, Event, Flight, IndustryWithCount, SearchResults, CountryWithCount, Category, Tag, RecommendedTrip } from '../types'; // Import types

// Determine environment-specific base URL
const getBaseUrl = (): string => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || '' 
    : '';
  
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('getBaseUrl() returning:', baseUrl);
  return baseUrl;
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
    industry?: string,
    region?: string,
    startDate?: string,
    endDate?: string,
    categories?: string,
    tags?: string,
    country?: string,
    keywords?: string
  }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add only non-empty parameters
      if (params.industry) queryParams.append('industry', params.industry);
      if (params.region) queryParams.append('region', params.region);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.categories) queryParams.append('categories', params.categories);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.country) queryParams.append('country', params.country);
      if (params.keywords) queryParams.append('keywords', params.keywords);
      
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
   * Get a single accommodation by its ID
   */
  getAccommodationById: async (id: string | number): Promise<Accommodation | null> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/accommodations/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Return null if accommodation not found
        }
        throw new Error(`API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error, `accommodation/${id}`);
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

  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/events/categories`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'categories');
    }
  },

  /**
   * Get all tags
   */
  getTags: async (): Promise<Tag[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/events/tags`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'tags');
    }
  },

  /**
   * Get recommended trips
   */
  getRecommendedTrips: async (): Promise<RecommendedTrip[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/recommended-trips`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return handleApiError(error, 'recommended-trips');
    }
  },
};
