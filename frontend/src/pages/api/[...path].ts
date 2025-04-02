import { NextApiRequest, NextApiResponse } from 'next';

// Configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

// Headers that should not be proxied
const EXCLUDED_HEADERS = new Set([
  'host',
  'connection',
  'content-length',
  'transfer-encoding',
  'accept-encoding'
]);

// Helper function to filter headers
const filterHeaders = (headers: Record<string, string | string[] | undefined>): Record<string, string> => {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    if (!EXCLUDED_HEADERS.has(key.toLowerCase()) && value) {
      acc[key] = Array.isArray(value) ? value.join(', ') : value.toString();
    }
    return acc;
  }, {} as Record<string, string>);
};

// Helper function to check if error is a connection error
const isConnectionError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed')
  );
};

// Helper function to safely parse JSON
const safeJsonParse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      return { error: 'Invalid JSON response from backend' };
    }
  }
  // For non-JSON responses, return the text
  return { text: await response.text() };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the path parameters
  const { path } = req.query;
  
  // Reconstruct the API path
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Get the backend URL (in Docker development: http://backend:5000)
  const backendUrl = process.env.BACKEND_URL || 'http://backend:5000';
  
  let lastError: Error | null = null;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Log the request attempt
      console.log(`Attempt ${retryCount + 1}/${MAX_RETRIES} - Proxying ${req.method} request to: ${backendUrl}/${apiPath}`);
      
      if (retryCount > 0) {
        console.log('Previous error:', lastError?.message);
      }

      // Forward the request to the backend
      // Remove any leading slashes from apiPath to avoid double slashes
      const cleanPath = typeof apiPath === 'string' ? apiPath.replace(/^\/+/, '') : '';
      if (!cleanPath) {
        throw new Error('Invalid API path');
      }
      const response = await fetch(`${backendUrl}/${cleanPath}`, {
        method: req.method,
        headers: filterHeaders(req.headers),
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });
      
      // Log the response status
      console.log(`Received response status: ${response.status}`);
      
      // Get the response data
      const data = await safeJsonParse(response);
      
      // Copy relevant response headers
      const responseHeaders = filterHeaders(Object.fromEntries(response.headers.entries()));
      Object.entries(responseHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      
      // Send the response back to the client
      res.status(response.status).json(data);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // If it's a connection error and we haven't exceeded retries, try again
      if (isConnectionError(error) && retryCount < MAX_RETRIES - 1) {
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
          MAX_RETRY_DELAY
        );
        
        console.log(`Connection error on attempt ${retryCount + 1}. Retrying in ${delay}ms...`);
        console.log('Error details:', {
          message: lastError.message,
          stack: lastError.stack
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
        continue;
      }
      
      // If it's not a connection error or we're out of retries, throw
      throw error;
    }
  }
  
  // If we get here, all retries failed
  console.error('API proxy error after all retries:', lastError);
  res.status(503).json({
    error: 'Service temporarily unavailable',
    details: 'Backend service is not ready. Please try again later.',
    technicalDetails: lastError?.message || 'Unknown error',
    retryAttempts: retryCount
  });
}
