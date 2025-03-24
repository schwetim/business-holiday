# systemPatterns.md

## 🧠 How the System is Built
A lightweight web platform using modern JAMstack principles:
- Static frontend served via CDN (Next.js + TailwindCSS)
- Dynamic content loaded via REST API (Node.js + Express + TypeScript)
- Minimal database use (events, logs only)
- External booking flows via affiliate APIs (Booking.com, WayAway)

## 🧱 Key Technical Decisions
- Use affiliate links for booking = no regulatory overhead
- No authentication = lower complexity and faster development
- Manual data for events = easy to control quality at launch
- Real-time API fetches for hotels/flights = always fresh data
- Click tracking for affiliate analytics

## 🧰 Architecture Patterns
- **Modular monolith**: Single repo, structured folders by domain (api, ui, db)
- **RESTful API design**: Simple JSON contracts
- **Static + dynamic hybrid**: Pre-rendered pages + API-interpolated content
- **Incremental adoption**: Easy to replace/scale any part later

## 🛡️ Principles Followed
- Keep it simple (KISS)
- Build only what’s needed (YAGNI)
- Secure by default (don’t store unnecessary data)
- Fail gracefully (timeout-safe APIs, loading states)
- Scale with confidence (no single point of failure)

