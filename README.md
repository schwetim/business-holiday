# Business Holiday Booking Platform

Internal development repository for the Business Holiday Booking platform - combining professional events with leisure travel opportunities.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Git

### Development Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd business-holiday-booking
   ```

2. Set up environment variables:
   ```bash
   # Frontend environment setup
   cp frontend/.env.example .env.frontend
   
   # Backend environment setup
   cp backend/.env.example .env.backend
   ```

   Configure the environment files:
   - `.env.frontend`:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API URL
     NEXT_TELEMETRY_DISABLED=1                  # Disable Next.js telemetry
     NODE_ENV=development                       # Environment mode
     ```
   - `.env.backend` (documentation in backend/.env.example)

3. Start the development environment:
   ```bash
   docker compose up --build
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

## 🏗 Project Structure

```
business-holiday-booking/
├── frontend/               # Next.js frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── Dockerfile.dev     # Development Docker configuration
├── backend/               # Express.js API server
│   ├── src/               # Source code
│   └── Dockerfile.dev     # Development Docker configuration
├── docs/                  # Project documentation
│   ├── activeContext.md   # Current development focus
│   ├── productContext.md  # Product vision and goals
│   ├── systemPatterns.md  # Architecture patterns
│   └── techContext.md     # Technical specifications
└── docker-compose.yml     # Container orchestration
```

## 📚 Documentation

- [Product Context](docs/productContext.md) - Why this exists
- [Active Context](docs/activeContext.md) - Current focus
- [System Patterns](docs/systemPatterns.md) - Architecture
- [Technical Context](docs/techContext.md) - Tech stack
- [Codebase Summary](docs/codebaseSummary.md) - Code overview

## 🔄 Development Workflow

1. Create feature branch from `main`
2. Implement changes
3. Run tests (when implemented)
4. Create PR with:
   - Clear description
   - Link to related issue
   - Screenshots (if UI changes)
5. Get code review
6. Merge to `main`

## 🧪 Testing

- Frontend: (TBD)
- Backend: (TBD)
- Integration: (TBD)

## 📦 Deployment

- Frontend → Vercel
- Backend → Render
- Database → Supabase

## 🛠 Common Tasks

### Environment Management
```bash
# Check frontend environment
docker compose exec frontend env

# Check backend environment
docker compose exec backend env

# Reload environment after changes
docker compose down
docker compose up --build
```

### Database Management
```bash
# Generate Prisma client
docker compose exec backend npx prisma generate

# Run migrations
docker compose exec backend npx prisma migrate dev

# Reset database (caution: deletes all data)
docker compose exec backend npx prisma migrate reset
```

### Auto-Test Data Import

When running the backend in development mode, a CSV import script automatically runs on startup. This ensures your development database always has test data available.

The import process:
- Reads from `/backend/import/events.csv`
- Only runs when `NODE_ENV=development`
- Checks for duplicates using `externalId`
- Skips existing events
- Maps image paths automatically

You can also manually trigger the import:
```bash
docker compose exec backend npm run import:dev-data
```

To skip the auto-import:
- Set `NODE_ENV=production` in your environment
- Or remove the import step from the `dev` script in `backend/package.json`

### Adding Dependencies
```bash
# Frontend
docker compose exec frontend npm install [package-name]

# Backend
docker compose exec backend npm install [package-name]
```

### Running Tests (TBD)
```bash
# Frontend
docker compose exec frontend npm test

# Backend
docker compose exec backend npm test
```

## 🤝 Contributing

1. Follow the branching strategy
2. Keep PRs focused and atomic
3. Update documentation
4. Add tests for new features
5. Follow existing code style

## 📝 License

Internal use only - Not for distribution
