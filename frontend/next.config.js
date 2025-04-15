/**
 * Next.js configuration
 * 
 * Development: Proxies API requests from browser to backend container
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
}

module.exports = nextConfig
