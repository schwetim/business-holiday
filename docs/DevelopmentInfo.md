# DevelopmentInfo.md

This guide is for developers working on the MVP of the Business + Holiday Travel Matchmaking platform. It outlines how the project should be developed, deployed, and maintained.

---

## 🧱 Project Structure

```
root/
├── frontend/         # Next.js + TailwindCSS
├── backend/          # Express + TypeScript API
├── prisma/           # Database schema
├── .env              # Shared secrets for local dev
├── .github/workflows # CI/CD pipelines
```

---

## 🌐 Hosting Setup

### ✅ Vercel (Frontend Hosting)
1. Connect your GitHub repo to [Vercel](https://vercel.com/)
2. Select `/frontend` as the root directory
3. Set environment variables under "Project Settings > Environment Variables":
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`
   - `BOOKING_AFFILIATE_ID=xxxx`
   - `WAYAWAY_AFFILIATE_ID=yyyy`
4. Every push to `main` triggers a deployment

### ✅ Render (Backend Hosting)
1. Go to [Render.com](https://render.com/)
2. Create new Web Service
3. Connect to GitHub, select `/backend`
4. Use these settings:
   - Environment: Node
   - Start Command: `npm run start`
   - Build Command: `npm install && npm run build`
   - Root Directory: `backend/`
   - Environment Variables:
     - `DATABASE_URL=postgresql://...`
     - `ALLOWED_ORIGINS=https://your-frontend.vercel.app`
5. Ensure CORS and API routes are publicly accessible

---

## 🧪 Environment Handling

### GitHub Branches
- `main` → Always production-ready
- `dev` → Active development branch (merge feature branches into this)
- `feature/*` → Feature-specific branches

### Environments
| Environment | Branch | Vercel URL                | Render Backend            |
|-------------|--------|---------------------------|---------------------------|
| Development | dev    | `dev-yourproject.vercel.app` | `dev-yourapi.onrender.com` |
| Production  | main   | `yourproject.vercel.app`  | `yourapi.onrender.com`    |

**Frontend automatically pulls from the correct backend by using `NEXT_PUBLIC_API_URL` set in Vercel settings.**

---

## 🔁 CI/CD Pipeline

### Tools
- GitHub Actions
- Vercel (built-in CI/CD)
- Render (auto-deploy on push)

### Frontend Deployment (Vercel)
- Automatically triggered by push to `main`
- Preview deploys available for PRs
- Rollbacks available in Vercel dashboard

### Backend Deployment (Render)
- Automatically triggered by push to `main`
- Build and start commands run as defined
- Logs visible in Render dashboard

### GitHub Actions (CI Only)
- Optional `.github/workflows/lint-test.yml`:
```yaml
name: CI - Lint and Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Dependencies
        run: npm install
      - name: Run Lint
        run: npm run lint
      - name: Run Tests
        run: npm test
```

---

## 🧠 Dev Hints & Best Practices

- Use `.env.local` for local dev (NEVER commit secrets)
- Store reusable constants and endpoint URLs in a `/config` file
- Split backend routes clearly: `/events`, `/clicks`, `/booking`
- Use `axios` or `fetch` with central error handling
- Enable `strict` mode in TypeScript
- Use `Zod` or similar for runtime validation (if needed)
- Add loading states to all pages with external API calls
- Use simple Tailwind utility classes before adding custom CSS

---

## ✅ Final Checklist Before Deployment
- [ ] All `.env` variables set for prod & dev
- [ ] Backend deployed and tested with frontend
- [ ] All affiliate links tested (Booking, WayAway)
- [ ] Basic tracking implemented (`/out` redirect logs clicks)
- [ ] Pages render well on desktop resolutions (no mobile scope)
- [ ] GitHub Issues / Kanban board up-to-date

---
This document ensures smooth setup and development for solo or team contributors. Happy shipping! 🚀

