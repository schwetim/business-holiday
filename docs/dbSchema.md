# dbSchema.md

## 🗂 Database Schema (MVP Only)

This schema is intentionally minimal — it only stores what’s required for the MVP:
- Events (curated list)
- Click tracking (for affiliate performance analytics)
- Booking reference (optional, internal logging only)

---

## 📄 Tables

### `events`
Stores curated event metadata.
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  website_url TEXT,
  ticket_price NUMERIC(10,2)
);
```

### `click_logs`
Logs user clicks on affiliate links for performance tracking.
```sql
CREATE TABLE click_logs (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  click_type TEXT CHECK (click_type IN ('hotel', 'flight', 'ticket')),
  redirect_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `bookings` (optional)
Internal reference log for debugging and data consistency (not tied to payment).
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  hotel_name TEXT,
  flight_summary TEXT,
  total_estimate NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧱 Schema Design Notes
- No user authentication → no `users` table
- All data is anonymous/log-level only
- Affiliate tracking handled via click redirection + logs
- Simple, flat schema = easy to query, maintain, and back up

---

✅ Easy to extend in full product (e.g. user accounts, favorites)
✅ Designed for affiliate-first MVP
✅ Works cleanly with Prisma or SQL directly

