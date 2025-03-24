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
- **PostgreSQL**: Primary database (can be hosted via Supabase/Render/Fly.io)
- **Prisma ORM**: Simplifies schema, migration, and querying

## 🧪 Development Setup

- Monorepo (optional) or separate `/frontend` and `/backend` folders
- Environment Variables for:
  - API keys (Google Maps, Booking.com ID, WayAway token)
- Local dev via Docker or native install
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
- **Backend**: Render / Fly.io (Node app)
- **Database**: Supabas&#x20;
- **Image Hosting**: Vercel asset pipeline or S3 (optional)

