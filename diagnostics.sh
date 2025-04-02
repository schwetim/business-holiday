#!/bin/bash
# Diagnostics script to trace network requests from the frontend through Next.js API routes to the backend

# Set -x to enable tracing
set -x

# Log the value of the BACKEND_URL environment variable in the frontend container
echo "BACKEND_URL environment variable in the frontend container:"
docker compose exec frontend sh -c "echo \$BACKEND_URL"

# Test the connection from the frontend container to the backend container using curl
echo "Testing connection from the frontend container to the backend container using curl:"
docker compose exec frontend sh -c "curl -v http://backend:5000/api/events/industries"

# Log the DNS resolution of the backend container name from the frontend container
echo "DNS resolution of the backend container name from the frontend container:"
docker compose exec frontend sh -c "nslookup backend"

# Log the timing of requests between containers
echo "Timing of requests between containers:"
docker compose exec frontend sh -c "time curl -s http://backend:5000/api/events/industries > /dev/null"

# Log the request and response headers at each step of the request flow
echo "Request and response headers at each step of the request flow:"
docker compose exec frontend sh -c "curl -v http://backend:5000/api/events/industries"
