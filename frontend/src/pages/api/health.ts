import { NextApiRequest, NextApiResponse } from 'next';

// Keep track of last check time to implement backoff
let lastCheckTime = 0;
let consecutiveFailures = 0;
const MIN_CHECK_INTERVAL = 2000; // 2 seconds minimum between checks
const MAX_BACKOFF = 30000; // Maximum 30 seconds backoff

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Calculate time since last check
  const now = Date.now();
  const timeSinceLastCheck = now - lastCheckTime;
  
  // Implement backoff based on consecutive failures
  const backoffTime = Math.min(MAX_BACKOFF, Math.pow(2, consecutiveFailures) * 1000);
  
  // If we're checking too frequently, return the last known status
  if (timeSinceLastCheck < Math.max(backoffTime, MIN_CHECK_INTERVAL)) {
    return res.status(429).json({
      status: 'throttled',
      message: 'Health check throttled to prevent overloading',
      nextCheckIn: Math.max(backoffTime, MIN_CHECK_INTERVAL) - timeSinceLastCheck,
      consecutiveFailures
    });
  }
  
  // Update last check time
  lastCheckTime = now;
  
  // Get the backend URL
  const backendUrl = process.env.BACKEND_URL || 'http://backend:5000';
  
  try {
    // Use AbortController to set a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (response.ok) {
      // Reset failure count on success
      consecutiveFailures = 0;
      
      // Try to parse backend response
      try {
        const data = await response.json();
        return res.status(200).json({
          status: 'ok',
          message: 'Backend is ready',
          backendStatus: data
        });
      } catch (e) {
        // If response is not JSON, still count as success
        return res.status(200).json({
          status: 'ok',
          message: 'Backend is available but returned non-JSON response'
        });
      }
    } else {
      // Increment failure count
      consecutiveFailures++;
      
      return res.status(503).json({
        status: 'error',
        message: `Backend returned status ${response.status}`,
        nextCheckIn: backoffTime,
        consecutiveFailures
      });
    }
  } catch (error) {
    // Increment failure count
    consecutiveFailures++;
    
    // Log error but with less verbosity to prevent flooding
    console.log(`Health check: Backend is not ready: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return res.status(503).json({
      status: 'error',
      message: 'Backend service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error',
      nextCheckIn: backoffTime,
      consecutiveFailures
    });
  }
}
