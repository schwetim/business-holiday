# activeContext.md

## ✅ Current Focus: MVP Implementation

We're building the Minimum Viable Product (MVP) with:

- Event selection interface
- Hotel and flight suggestions
- Affiliate redirection
- No user accounts or booking logic

## 🧭 Immediate Next Steps

### 1. Core App Setup

✅ Frontend container running with Next.js
✅ Backend container running with Express
✅ Database container ready
✅ Set up initial API endpoints (/api/events)
✅ Configure frontend environment (NEXT_PUBLIC_API_URL) with proper Docker networking setup
✅ Set up frontend routing structure:
  - Home page with search form and HeroBanner
  - Events listing page with API integration
  - Test environment page
✅ Implement core UI components:
  - HeroBanner with responsive design
  - IndustrySelect with API integration
  - SelectField reusable component

### 2. Data Layer

✅ Set up Prisma schema
✅ Configure database migrations
✅ Implement data models for:
  - Events (with full address and import fields)
  - Click tracking
  - Bookings (reference only)
✅ Implement CSV import functionality:
  - Auto-import test data in development
  - Support for external IDs and image paths
  - Duplicate prevention via externalId

### 3. Feature Development

- Implement search interface
- Add event listing page
- Integrate hotel suggestions
- Add flight search functionality
- Implement affiliate redirects

### 4. Testing + Launch

- Write integration tests
- Perform load testing
- Set up monitoring
✅ Configure production deployment (Dockerfile with multi-stage build)
- Launch MVP version

## 🧱 Scope Guardrails

- No login/account system
- No actual booking/payment logic
- No mobile optimization (for MVP)
