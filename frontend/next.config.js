/**
 * Next.js configuration
 * 
 * Development: 
 * - Proxies API requests from browser to backend container
 * - Configures webpack to watch for file changes in Docker
 * Production: No proxy - direct API calls to Render backend URL
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    if (process.env.NODE_ENV === 'development') {
      // Only in development: proxy /api requests to the backend container
      return [{
        source: '/api/:path*',
        destination: 'http://backend:5000/api/:path*',
      }];
    }
    // In production: no rewrites needed - direct API calls to Render
    return [];
  },
  
  // Add webpack configuration for development
  ...(process.env.NODE_ENV === 'development' ? {
    webpackDevMiddleware: (config) => {
      // Configure webpack to poll for changes
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      return config;
    },
  } : {})
}

module.exports = nextConfig
