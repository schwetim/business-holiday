# techContext.md

## 🛠 Technologies Used

### Frontend

- **Next.js**: React framework with static generation and routing
  - Development: API routes for proxying requests
  - Production: Direct API calls to backend URL
- **TailwindCSS**: Utility-first CSS for fast UI development
- **Google Maps JS API**: For visualizing event locations
- **Affiliate Widgets**: WayAway (via Travelpayouts), Booking.com Deep Links

### Backend

- **Node.js + Express**: Lightweight REST API layer
- **TypeScript**: For static typing and dev safety
- **PostgreSQL**: Primary database (hosted via Render)
- **Prisma ORM**: Type-safe schema, migration, and querying
- **Docker**: Multi-stage builds for development and production

## 🧪 Development Setup

- Separate `/frontend` and `/backend` folders
- Environment Variables:
  Frontend (.env.frontend):
    - NODE_ENV=development (in Docker)
    - BACKEND_URL=http://backend:5000 (for API proxy)
    - NEXT_TELEMETRY_DISABLED=1
  Backend (.env.backend):
    - DATABASE_URL
    - PORT=5000
    - CORS_ORIGIN=http://localhost:3000
  External APIs:
    - Google Maps API key
    - Booking.com affiliate ID
    - WayAway token
- Local Development:
  - Docker Compose for service orchestration
  - Volume mounts for hot reloading
  - Environment-specific configurations
  - Next.js API routes for request proxying
- Git-based deployment workflows (GitHub → Vercel / Render)

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
  - Backend container on port 5000
    - Direct container-to-container communication
  - Database container on port 5432
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
