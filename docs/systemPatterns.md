# systemPatterns.md

## 🧠 How the System is Built
A lightweight web platform using modern JAMstack principles:
- Static frontend served via CDN (Next.js + TailwindCSS)
- Dynamic content loaded via REST API (Node.js + Express + TypeScript)
- Prisma ORM for type-safe database access
- External booking flows via affiliate APIs (Booking.com, WayAway)

## 🧱 Key Technical Decisions
- Use affiliate links for booking = no regulatory overhead
- No authentication = lower complexity and faster development
- CSV-based event import = flexible data management
- Automatic development data = consistent testing environment
- Real-time API fetches for hotels/flights = always fresh data
- Click tracking for affiliate analytics
- Multi-stage Docker builds = optimized production images
- Prisma for type-safe database access = reduced runtime errors
- Environment-based configuration = flexible deployment options
- Next.js API routes for development = simplified local setup

## 🧰 Architecture Patterns

### API Layer Design
- **Development Environment:**
  - Next.js API routes proxy requests to backend
  - Container-to-container communication
  - Hot reloading support
  - Local debugging capabilities

- **Production Environment:**
  - Direct API calls to backend URL
  - Environment variables from Vercel/Render
  - Optimized for performance
  - No proxy overhead

### Core Patterns
- **Modular monolith**: Single repo, structured folders by domain (api, ui, db)
- **Component-based UI**: Reusable components (HeroBanner, SelectField, DestinationSelect)
- **RESTful API design**: Simple JSON contracts (/api/events)
- **Static + dynamic hybrid**: Pre-rendered pages + API-interpolated content
- **Incremental adoption**: Easy to replace/scale any part later

### Docker Architecture
- **Docker-first development**: 
  - Consistent environments across team
  - Volume mounts for hot reloading
  - Environment-specific configurations
  - Container networking for local development

### Data Layer
- **Type-safe data layer**: Prisma schema as single source of truth
- **Environment Configuration**:
  - Service-specific .env files
  - Public vs private variables separation
  - Docker-compatible env management
- **Development Data Management**:
  - Auto-import on startup in dev mode
  - External ID tracking for deduplication
  - Structured image path mapping
  - Environment-aware data loading

### API Service Pattern
- **Centralized API Service**:
  - Single source of truth for API calls
  - Environment-aware base URL configuration
  - Unified error handling
  - Type-safe interfaces
  - Prevents duplicate requests
  - Consistent request/response patterns

## 🛡️ Principles Followed
- Keep it simple (KISS)
  - Clear separation of development/production environments
  - Intuitive API service design
  - Minimal configuration needed
- Build only what's needed (YAGNI)
  - Environment-specific optimizations
  - No unnecessary abstractions
- DRY (Don't Repeat Yourself)
  - Centralized API logic
  - Reusable components
  - Shared type definitions
- Secure by default
  - Don't store unnecessary data
  - Environment-based security
- Fail gracefully
  - Timeout-safe APIs
  - Loading states
  - Error boundaries
- Scale with confidence
  - No single point of failure
  - Environment-specific optimizations
- Type safety over convenience
  - TypeScript + Prisma
  - Strict type checking
