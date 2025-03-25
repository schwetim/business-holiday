# MVP Development Specification

This document provides a full breakdown for developing the MVP of the Business + Holiday Travel Matchmaking Platform. It can be handed directly to a software engineer to begin development.

---

## 📘 Main Chapters
1. Project Setup
2. UI/UX Implementation
3. Backend API & Data Handling
4. External API Integration (Affiliate)
5. Click Tracking & Analytics
6. Deployment & Hosting
7. QA & Testing

---

## 1. Project Setup

### Task 1.1: Initialize Repositories & Dev Environment
**Context:** Begin with a monorepo structure or separate `/frontend` and `/backend` folders.
**Tools:** GitHub, Node.js, Yarn/NPM
**Acceptance Criteria:**
- Local dev environment set up
- Base project structure created
- GitHub repo initialized

### Task 1.2: Configure Hosting
**Context:** Set up for CI/CD deployment.
**Tools:**
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)
**Acceptance Criteria:**
- Frontend deploys from GitHub to Vercel
- Backend deploys from GitHub to Render
- Supabase database instance running

---

## 2. UI/UX Implementation

### Task 2.1: Build Global Layout and Navigation
**Context:** Simple top navigation bar and global layout
**Tools:** Next.js, TailwindCSS
**Acceptance Criteria:**
- Mobile-first layout not required
- Navigation links: Home, About (optional), Feedback (optional)

### Task 2.2: STEP 1 – User Input Form
**UI Elements:**
- Industry dropdown
- Departure airport input (with IATA autocomplete)
- Date range picker
**Acceptance Criteria:**
- Form inputs persist in session/local state
- Validations present
- On submit, redirects to events page

### Task 2.3: STEP 2 – Show Matching Events
**UI Elements:**
- Grid of cards
  - Event name (bold)
  - Location line
  - Estimated price (event + flight + hotel)
  - Expandable description
  - Select button
- Embedded Google Map with event markers
**Acceptance Criteria:**
- Selecting an event stores selection and navigates to next phase

### Task 2.4: STEP 3 – Show Hotels
**UI Elements:**
- Top content: Event name, description, website
- Phase Indicator: "Step 2 of 4: Hotel"
- 9 hotel cards
- CTA: "Show more on Booking.com" (opens in new tab)
- Button: "Next phase: Flights"
**Acceptance Criteria:**
- Booking.com affiliate link used
- Hotel cards display name, price, rating, distance

### Task 2.5: STEP 4 – Show Flights
**UI Elements:**
- Phase Indicator: "Step 3 of 4: Flights"
- 3 wide cards: arrival 1–3 days before event
- Each has select button linking to WayAway.io (affiliate)
**Acceptance Criteria:**
- Cards display valid flight summary and affiliate link

### Task 2.6: STEP 5 – Event Ticket Info
**UI Elements:**
- Full event info block (name, date, location, description)
- Button: "Buy tickets" → opens external link
**Acceptance Criteria:**
- Final phase clearly presented

---

## 3. Backend API & Data Handling

### Task 3.1: Event API
**Context:** Events are manually curated in MVP
**Acceptance Criteria:**
- REST endpoint: `GET /events?industry=...&date_range=...`
- Returns events with metadata (location, price, link)

### Task 3.2: Click Logging
**Context:** Track user clickouts to affiliate links
**Acceptance Criteria:**
- REST endpoint: `POST /click`
- Captures: event_id, click_type, redirect_url

### Task 3.3: Booking Record (Optional)
**Context:** Internal record of generated booking context
**Acceptance Criteria:**
- REST endpoint: `POST /booking`
- Stores selected event, hotel, flight summary, total estimate

---

## 4. External API Integration

### Task 4.1: Booking.com Affiliate
**Context:** Use affiliate links or deep link widgets
**Acceptance Criteria:**
- Hotel links use correct Booking.com affiliate tag
- “Show more” button contains search query with event location + dates

### Task 4.2: WayAway.io Flights
**Context:** Embed widget or generate links via Travelpayouts
**Acceptance Criteria:**
- Outbound flight links contain affiliate token
- 3 arrival options calculated from event start date

---

## 5. Click Tracking & Analytics

### Task 5.1: Redirect Handler for Clicks
**Context:** Track affiliate clicks internally before redirecting
**Acceptance Criteria:**
- All outbound links go via: `/out?type=hotel&id=123`
- Logs to `click_logs`
- Redirects to actual affiliate URL

### Task 5.2: Simple Analytics Dashboard (Optional)
**Context:** View total clicks per event, type
**Acceptance Criteria:**
- Basic frontend table from `click_logs`

---

## 6. QA & Testing

### Task 6.1: Unit + API Testing
**Tools:** Jest, Supertest
**Acceptance Criteria:**
- Tests for `/events`, `/click`, `/booking`

### Task 6.2: End-to-End Flow Test
**Tools:** Cypress
**Acceptance Criteria:**
- Search → Event → Hotel → Flight → Ticket tested
- UI behaves correctly in each phase

---

## 7. Deployment & Go-Live

### Task 7.1: Frontend → Vercel
**Acceptance Criteria:**
- Production site deployed via GitHub push
- Environment variables secured in Vercel

### Task 7.2: Backend → Render
**Acceptance Criteria:**
- Express server live
- API accessible to frontend

### Task 7.3: Database → Supabase
**Acceptance Criteria:**
- Tables: `events`, `click_logs`, `bookings`
- Accessible from backend with connection pool

---

## ✅ Final Notes
- Focus on desktop experience only
- Prioritize working booking flow over features
- Style clean, minimalist UI
- Use comments, simple structure for handoff and maintainability

This document allows a software engineer to start implementing the MVP with minimal guidance.

