# codebaseSummary.md

## 🏗 Project Structure

### Frontend (`/frontend`)
- Next.js application with TypeScript
- TailwindCSS for styling
- Pages structure for routing:
  - Home page (search form)
  - Events page (dynamic listing)
  - Test environment page
- Environment configuration via .env.frontend
- Docker containerized with volume mounts

### Backend (`/backend`)
- Express.js server with TypeScript
- RESTful API design (/api/events endpoint)
- Docker containerized (dev and prod)
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
- Initialized project structure
- Set up Docker containers
- Configured TypeScript
- Established basic Express server
- Created Next.js frontend
- Implemented Prisma ORM with models
- Added /api/events endpoint
- Created production Dockerfile with multi-stage build
- Set up frontend environment variables (NEXT_PUBLIC_API_URL)
- Implemented frontend routing structure
- Added API integration in events page
- Created test environment page for debugging
- Enhanced Event model with address and import fields
- Added development auto-import functionality
- Implemented CSV-based event import system

## 👥 User Feedback Integration
- No user feedback yet (pre-launch)
- Planning to add analytics for:
  - Search patterns
  - Click-through rates
  - Conversion tracking
