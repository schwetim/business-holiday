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
- Configure frontend routing
- Implement basic UI components

### 2. Data Layer

✅ Set up Prisma schema
✅ Configure database migrations
✅ Implement data models for:
  - Events
  - Click tracking
  - Bookings (reference only)

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
