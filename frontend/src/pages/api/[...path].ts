import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the path parameters
  const { path } = req.query;
  
  // Reconstruct the API path
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Get the backend URL (in Docker development: http://backend:5000)
  const backendUrl = process.env.BACKEND_URL || 'http://backend:5000';
  
  try {
    // Log the request being proxied
    console.log(`Proxying request to: ${backendUrl}/${apiPath}`);
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/${apiPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Send the response back to the client
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from backend' });
  }
}
