# HighLevelArchitecture.md

## 🎯 Purpose
Design a simple, maintainable, scalable architecture for a solo developer to build and manage the MVP of a business+holiday travel platform.

## 🏗️ Architectural Overview
This architecture prioritizes **simplicity**, **affiliate integration**, and **scalability-ready** design for future upgrades.

```
User
 ↓
Frontend (Next.js, TailwindCSS)
 ↓
API Layer (Node.js / Express + TypeScript)
 ↓
Backend Services
 ├─ PostgreSQL (Events & Bookings)
 ├─ External APIs
 │   ├─ Booking.com (Affiliate)
 │   ├─ WayAway.io (Flights)
 │   └─ Event Organizer Sites (manual/external)
 ↓
Deployment (Vercel + Supabase/Render/Fly.io)
```

## 🧱 Key Layers
1. **Frontend**: Fast, SSR/SSG pages for performance. Controlled routing through booking flow.
2. **Backend**: RESTful API endpoints with slim business logic. Handles search, affiliate link generation, and user sessions.
3. **Data**: Only minimal data stored (event metadata, bookings, click logs). No user accounts in MVP.
4. **External Services**: Affiliate APIs handle booking logic. We generate & track outbound links.

## 🚧 MVP Focus Areas
- Manual event DB
- Real-time affiliate calls (hotels/flights)
- Click tracking for analytics
- Minimal stateful logic (no auth, no checkout)

---

✅ Simple to build, debug, deploy
✅ Easy to scale to full product
✅ Aligns with affiliate revenue model
✅ Designed for solo dev without overhead

