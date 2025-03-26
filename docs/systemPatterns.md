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

## 🧰 Architecture Patterns
- **Modular monolith**: Single repo, structured folders by domain (api, ui, db)
- **RESTful API design**: Simple JSON contracts (/api/events)
- **Static + dynamic hybrid**: Pre-rendered pages + API-interpolated content
- **Incremental adoption**: Easy to replace/scale any part later
- **Docker-first development**: 
  - Consistent environments across team
  - Volume mounts for hot reloading
  - Environment-specific configurations
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

## 🛡️ Principles Followed
- Keep it simple (KISS)
- Build only what's needed (YAGNI)
- Secure by default (don't store unnecessary data)
- Fail gracefully (timeout-safe APIs, loading states)
- Scale with confidence (no single point of failure)
- Type safety over convenience (TypeScript + Prisma)
