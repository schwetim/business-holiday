# codebaseSummary.md

## 🏗 Project Structure

### Frontend (`/frontend`)
- Next.js application with TypeScript
- TailwindCSS for styling
- Pages structure for routing
- Docker containerized

### Backend (`/backend`)
- Express.js server with TypeScript
- RESTful API design (/api/events endpoint)
- Docker containerized (dev and prod)
- Prisma ORM with PostgreSQL

### Database
- PostgreSQL container
- Prisma schema with models:
  - Event (business events)
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

## 👥 User Feedback Integration
- No user feedback yet (pre-launch)
- Planning to add analytics for:
  - Search patterns
  - Click-through rates
  - Conversion tracking
