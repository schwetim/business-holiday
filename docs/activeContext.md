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
✅ Implement environment-aware API service:
  - Development: Next.js API routes for proxying
  - Production: Direct API calls to backend
  - Unified error handling
  - Prevention of duplicate calls

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

Current Focus:
- Implement search interface
  ✅ Industry selection with API integration
  - Region/location selection
  - Date range picker

Upcoming Features:

#### 🗺️ Event Browsing & Selection
- Event card components with:
  - Basic info display
  - Expandable details (description, websiteUrl, ticketPrice)
  - Loading states and error handling
- Event selection flow:
  - Location locking mechanism
  - Automatic navigation to hotel selection
  - Progress tracking

#### 🏨 Hotel Integration
- Hotel selection interface:
  - Location-based filtering
  - Price range filters
  - Booking.com API integration
  - Loading and error states
- Data requirements:
  - Hotel availability API
  - Price comparison endpoints
  - Deep linking setup

#### ✈️ Flight Integration
- Flight search interface:
  - Origin airport selection
  - Date range picker
  - WayAway API integration
  - Price tracking
- Data flow:
  - Search parameters validation
  - Real-time availability checks
  - Price aggregation

#### 📊 Analytics & Tracking
- User flow tracking:
  - Page views and interactions
  - Conversion tracking
  - Affiliate link clicks
- Integration points:
  - Google Analytics
  - Custom event tracking
  - Affiliate dashboards

#### 🔌 External Integrations
- Strapi CMS:
  - Event content management
  - Dynamic data updates
  - Media handling
- Affiliate APIs:
  - Booking.com setup
  - WayAway integration
  - Commission tracking

#### 🔐 Optional Enhancements
- User authentication
- Saved searches
- Booking history
- Price alerts

### 4. Testing + Launch

- Write integration tests:
  - User flow testing
  - API integration tests
  - Performance benchmarks
- Perform load testing:
  - Concurrent user simulation
  - API response times
  - Database performance
- Set up monitoring:
  - Error tracking
  - Performance metrics
  - User analytics
✅ Configure production deployment (Dockerfile with multi-stage build)
✅ Set up environment-specific configurations:
  - Development: Docker-based with API proxying
  - Production: Vercel/Render with direct API calls
- Pre-launch checklist:
  - Security audit
  - Performance optimization
  - Analytics verification
  - Affiliate link testing
- Launch MVP version

## 🧱 Scope Guardrails

- No login/account system
- No actual booking/payment logic
- No mobile optimization (for MVP)

## 🔄 Recent Changes

1. Backend Availability Handling:
   - Added health check endpoint with rate limiting
   - Implemented exponential backoff (1s to 30s)
   - Added request timeout (3s)
   - Prevented log flooding during startup
   - Enhanced error reporting

2. API Service Resilience:
   - Added retry logic with exponential backoff
   - Implemented health check integration
   - Enhanced error handling and logging
   - Added direct backend fallback
   - Improved connection failure recovery

3. Component-Level Improvements:
   - Added retry logic to IndustrySelect
   - Implemented backend health verification
   - Added user feedback during retries
   - Added manual retry capability
   - Enhanced error state handling

4. Development Environment:
   - Added health check endpoints
   - Updated Docker startup handling
   - Improved error handling and debugging
   - Enhanced development/production separation
   - Added connection failure recovery

5. Documentation:
   - Updated technical documentation
   - Added health check patterns
   - Clarified startup procedures
   - Enhanced debugging guides
   - Added retry mechanism documentation
