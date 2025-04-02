import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the path parameters
  const { path } = req.query;
  
  // Reconstruct the API path
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Get the backend URL (in Docker development: http://backend:5000)
  const backendUrl = process.env.BACKEND_URL || 'http://backend:5000';
  
  try {
    // Log the request details
    console.log(`Proxying ${req.method} request to: ${backendUrl}/${apiPath}`);
    console.log('Request headers:', req.headers);
    if (req.body) {
      console.log('Request body:', req.body);
    }

    // Add more logging
    console.log(`Full backend URL: ${backendUrl}/${apiPath}`);
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/${apiPath}`, {
      method: req.method,
      headers: Object.entries(req.headers).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>),
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Log the response status
    console.log(`Received response status: ${response.status}`);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Get the response data
    const data = await response.json();
    console.log('Response data:', data);
    
    // Send the response back to the client
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    res.status(500).json({ 
      error: 'Failed to fetch data from backend',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
