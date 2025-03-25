# techContext.md

## 🛠 Technologies Used

### Frontend

- **Next.js**: React framework with static generation and routing
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
  - API keys (Google Maps, Booking.com ID, WayAway token)
  - Database connection (DATABASE_URL)
  - CORS settings (FRONTEND_URL)
- Local dev via Docker Compose
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
- **Backend**: Render (Node app with production Docker image)
- **Database**: Render PostgreSQL (managed instance)
- **Image Hosting**: Vercel asset pipeline or S3 (optional)

## 🔄 Development Workflow

- Local development uses Docker Compose
- TypeScript compilation in development and production
- Prisma migrations for database schema changes
- Multi-stage Docker builds for production
