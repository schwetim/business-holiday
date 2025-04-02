# techContext.md

## 🛠 Technologies Used

### Frontend

- **Next.js**: React framework with static generation and routing
  - Development: API routes for proxying requests
  - Production: Direct API calls to backend URL
  - Health check endpoint with rate limiting
  - Retry logic with exponential backoff
- **API Service Layer**:
  - Centralized request handling
  - Health check integration
  - Retry mechanism with backoff
  - Error handling and logging
- **Component Resilience**:
  - Built-in retry logic
  - Health status monitoring
  - User feedback during retries
  - Manual retry capabilities
- **TailwindCSS**: Utility-first CSS for fast UI development
- **Google Maps JS API**: For visualizing event locations
- **Affiliate Integrations**:
  - **Booking.com**:
    - Deep linking system
    - Commission tracking
    - Price comparison API
    - Availability checks
  - **WayAway (Travelpayouts)**:
    - Flight search API
    - Price tracking
    - Commission management
    - White-label integration
- **Analytics**:
  - Google Analytics
  - Custom event tracking
  - Conversion monitoring

### Backend

- **Node.js + Express**: Lightweight REST API layer
  - Health check endpoint (/api/health)
  - Docker health monitoring
  - wget-based health probing
  - 10s check interval with 5s timeout
  - 3 retry attempts with 10s startup grace
- **TypeScript**: For static typing and dev safety
- **PostgreSQL**: Primary database (hosted via Render)
- **Prisma ORM**: Type-safe schema, migration, and querying
- **Docker**: Multi-stage builds for development and production
  - Container health monitoring
  - Startup coordination
  - Connection resilience
  - Service readiness checks
- **Strapi CMS**:
  - Event content management
  - Media handling
  - API generation
  - Role-based access

## 🧪 Development Setup

- Separate `/frontend` and `/backend` folders
- Environment Variables:
  Frontend (.env.frontend):
    - NODE_ENV=development (in Docker)
    - BACKEND_URL=http://backend:5000 (for API proxy)
    - NEXT_TELEMETRY_DISABLED=1
    - NEXT_PUBLIC_GOOGLE_MAPS_KEY
    - NEXT_PUBLIC_GA_TRACKING_ID
  Backend (.env.backend):
    - DATABASE_URL
    - PORT=5000
    - CORS_ORIGIN=http://localhost:3000
  External APIs:
    - GOOGLE_MAPS_API_KEY
    - BOOKING_COM_AFFILIATE_ID
    - BOOKING_COM_API_KEY
    - WAYAWAY_PARTNER_ID
    - WAYAWAY_API_KEY
    - STRAPI_API_TOKEN
  Analytics:
    - GA_MEASUREMENT_ID
    - CONVERSION_TRACKING_ID
- Local Development:
  - Docker Compose for service orchestration
  - Volume mounts for hot reloading
  - Environment-specific configurations
  - Next.js API routes for request proxying
  - Health check-based startup coordination
  - Service readiness verification
- Git-based deployment workflows (GitHub → Vercel / Render)

## 🔌 External API Integration

### Booking.com API
- **Endpoints**:
  - `/api/hotels/search`: Search hotels by location
  - `/api/hotels/prices`: Get real-time pricing
  - `/api/hotels/availability`: Check room availability
- **Data Format**:
  ```typescript
  interface HotelSearch {
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    priceRange?: {
      min: number;
      max: number;
    };
  }
  ```

### WayAway API
- **Endpoints**:
  - `/api/flights/search`: Search available flights
  - `/api/flights/prices`: Get price history
  - `/api/flights/booking`: Generate booking links
- **Data Format**:
  ```typescript
  interface FlightSearch {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    passengers: number;
    class?: 'economy' | 'business';
  }
  ```

### Strapi CMS Integration
- **Content Types**:
  - Events
  - Locations
  - Industries
  - Media
- **API Endpoints**:
  - `/api/events`: CRUD operations
  - `/api/media`: File uploads
  - `/api/industries`: Reference data
- **Authentication**:
  - API token-based access
  - Role-based permissions

## 🚧 Technical Constraints

- No user authentication in MVP
- No internal payment handling (everything via affiliates)
- Affiliate tracking must be URL-based (deep link click tracking)
- No mobile-first optimizations (desktop MVP)
- SEO is useful, but not a priority for MVP
- UX must support step-by-step logic with persistent state across pages

## 🧱 Hosting Stack

- **Frontend**: Vercel (auto-deploy from GitHub)
  - Production: Uses NEXT_PUBLIC_API_URL for direct API calls
  - Environment variables managed via Vercel dashboard
- **Backend**: Render (Node app with production Docker image)
  - Production URL configured in frontend deployment
  - Separate staging/production environments
- **Database**: Render PostgreSQL (managed instance)
- **Image Hosting**: Vercel asset pipeline or S3 (optional)

## 🔄 Development Workflow

- Local development uses Docker Compose:
  - Frontend container on port 3000
    - API requests proxied through Next.js API routes
    - Hot reloading enabled
    - Health check monitoring
    - Retry mechanisms active
  - Backend container on port 5000
    - Direct container-to-container communication
    - Health status reporting
    - Quick startup detection
  - Database container on port 5432
  - Container startup coordination:
    - Health check polling
    - Connection retry logic
    - Status monitoring
    - Error rate limiting
- Environment-specific configurations:
  - Development: 
    - Local services with hot reloading
    - API proxying through Next.js
    - Container-to-container networking
  - Production:
    - Optimized builds
    - Direct API communication
    - Environment variables from deployment platforms
- TypeScript compilation in development and production
- Prisma migrations for database schema changes
- Multi-stage Docker builds for production
