# codebaseSummary.md

## 🏗 Project Structure

### Frontend (`/frontend`)
- Next.js application with TypeScript
- TailwindCSS for styling
- Pages structure for routing:
  - Home page (search form)
  - Events page (dynamic listing)
  - Test environment page
  - API routes:
    - Health check endpoint with rate limiting
    - Request proxy with retry logic
- API Service:
  - Centralized request handling
  - Health check integration
  - Retry mechanism with backoff
  - Error handling and logging
- Components:
  - IndustrySelect with retry logic
  - Loading states with attempt tracking
  - Manual retry capabilities
  - Error state handling
- Environment configuration via .env.frontend
- Docker containerized with volume mounts

### Backend (`/backend`)
- Express.js server with TypeScript
- RESTful API design:
  - /api/events endpoint
  - /api/health endpoint for status monitoring
  - Quick response times (3s timeout)
  - Connection status reporting
- Docker containerized (dev and prod):
  - Health monitoring
  - Startup coordination
  - Connection resilience
  - Service readiness checks
- Prisma ORM with PostgreSQL
- Auto-import script for development data
- CSV-based event import with image mapping

### Database
- PostgreSQL container
- Prisma schema with models:
  - Event (business events):
    - Full address fields (country, city, etc.)
    - Import support (externalId, imagePath)
    - Geolocation data (latitude, longitude)
  - ClickLog (affiliate tracking)
  - Booking (reference logging)

## 🔄 Data Flow
1. User inputs → Frontend
2. API requests → Backend
3. Data queries → Database via Prisma
4. External API calls → Affiliate services (pending)

## 📦 External Dependencies
- Node.js v20 (Alpine)
- PostgreSQL
- Express.js
- Next.js
- TypeScript
- TailwindCSS
- Prisma ORM
- (Pending) Affiliate APIs

## 🔄 Recent Changes

### Backend Availability Improvements
- Added Docker health check with wget probing
- Configured health check parameters:
  - 10s check interval
  - 5s timeout
  - 3 retry attempts
  - 10s startup grace period
- Added wget to backend container
- Enhanced startup coordination

### API Service Resilience
- Added retry logic with exponential backoff
- Implemented health check integration
- Enhanced error handling and logging
- Added direct backend fallback
- Improved connection failure recovery

### Component-Level Improvements
- Added retry logic to IndustrySelect
- Implemented backend health verification
- Added user feedback during retries
- Added manual retry capability
- Enhanced error state handling

### Development Environment
- Added Docker health checks
- Improved service startup coordination
- Enhanced proxy configuration
- Added direct backend access for health checks
- Improved error handling and debugging

### Previous Updates
- Initialized project structure
- Set up Docker containers
- Configured TypeScript
- Established basic Express server
- Created Next.js frontend
- Implemented Prisma ORM with models
- Added /api/events endpoint
- Created production Dockerfile with multi-stage build
- Set up frontend environment variables
- Implemented frontend routing structure
- Added API integration in events page
- Created test environment page
- Implemented core UI components
- Enhanced Event model
- Added development auto-import
- Implemented CSV-based import

## 👥 User Feedback Integration
- No user feedback yet (pre-launch)
- Planning to add analytics for:
  - Search patterns
  - Click-through rates
  - Conversion tracking
