# AI Signal — College Discovery Platform

> A production-grade college discovery and decision-making platform built for the AI Software Engineer Internship Demo Task (Track B). Inspired by platforms like Careers360 and CollegeDunia.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)

---

## What I Built

AI Signal is a full-stack college discovery platform with five core features:

1. **College Search & Listing** — Filterable, paginated college listing with state, fees, field, and keyword filters. Filters are applied intentionally via an "Apply Filters" action, preventing unnecessary re-fetches on every keystroke.

2. **College Detail Pages** — Per-college pages with overview, courses offered, placement statistics (average & highest package, top recruiters), accreditations, reviews, and a campus profile.

3. **College Comparison** — A side-by-side comparison tool (up to 3 colleges) covering fees, rating, location, placement, and available courses. Colleges are queued via a compare button on every card and listing page.

4. **AI Admission Predictor** — Users input their exam, rank or percentile, category, preferred state, budget, and field of study. A Google Gemini-powered backend analyzes this against the college database and returns ranked predictions labeled Safe, Moderate, or Ambitious — each with a reasoned explanation and strategic insight.

5. **Authentication + Saved Colleges** — Full credential-based sign-up/sign-in with bcrypt password hashing and NextAuth session management. Authenticated users can bookmark colleges and revisit their saved list.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma 7 with `@prisma/adapter-neon` |
| Auth | NextAuth v4 (Credentials + Google OAuth) |
| AI | Google Gemini (`@google/generative-ai`) |
| State | Zustand (compare store) |
| Icons | Lucide React |
| Deployment | Vercel-ready (static + serverless functions) |

---

## Project Structure

```
ai-signal/
│
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout with Navbar + Providers
│   ├── globals.css             # Global styles + Tailwind tokens
│   │
│   ├── colleges/
│   │   ├── page.tsx            # College listing + filter sidebar
│   │   └── [slug]/page.tsx     # College detail page
│   │
│   ├── predictor/
│   │   └── page.tsx            # AI Admission Predictor UI
│   │
│   ├── compare/
│   │   └── page.tsx            # Side-by-side college comparison
│   │
│   ├── saved/
│   │   └── page.tsx            # User's saved colleges
│   │
│   ├── auth/
│   │   ├── signin/page.tsx     # Sign-in form (wrapped in Suspense)
│   │   └── signup/page.tsx     # Registration form
│   │
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth handler
│       ├── colleges/           # GET all colleges with filters
│       ├── colleges/[slug]/    # GET single college by slug
│       ├── colleges/compare/   # GET multiple colleges for comparison
│       ├── predictor/          # POST — AI prediction engine
│       ├── register/           # POST — user registration
│       ├── saved/              # GET/POST — save a college
│       └── saved/[id]/         # DELETE — remove saved college
│
├── components/
│   ├── Navbar.tsx              # Sticky top nav with auth-aware links
│   └── Providers.tsx           # Session + Zustand provider wrappers
│
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth configuration
│   └── utils.ts                # Shared helpers (formatCurrency, getChanceColor)
│
├── store/
│   └── compareStore.ts         # Zustand store for comparison queue
│
├── types/
│   └── index.ts                # Shared TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma           # Database schema (5 models)
│   └── seed.ts                 # Seed script with real Indian college data
│
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Database Schema

Five models power the platform:

- **College** — Core entity: name, slug, city, state, fees range, rating, exam acceptance, accreditations, placement stats, recruiters, website.
- **Course** — Belongs to a college. Tracks name, duration, annual fees, eligibility, and field of study.
- **Review** — User-written reviews attached to a college, with a rating and year of passing.
- **User** — Authentication model: email, hashed password, name, OAuth image.
- **SavedCollege** — Junction table linking users to their bookmarked colleges (unique constraint per user-college pair).

---

## Key Features In Detail

### College Discovery
- Full-text search across college name and city
- Filter by state, fees range (min/max), and academic field
- Field quick-select with toggle buttons (Engineering, Medical, Management, Science)
- Paginated results (12 per page) with page number navigation
- Filters are applied explicitly — no unintended fetches while typing

### AI Predictor
- Powered by **Google Gemini** (`gemini-2.0-flash`)
- Input: exam type, rank or percentile, category (General/OBC/SC/ST), preferred state, max fees, field of interest
- Output: up to 5 ranked college recommendations, each classified as **Safe**, **Moderate**, or **Ambitious**
- Each result includes a reasoned explanation and strategic insight derived from the college's actual data
- Falls back gracefully to rule-based matching when AI is unavailable

### Compare Tool
- Add up to 3 colleges from any listing or detail page
- Comparison table covers: overall rating, location, fee range, placement average, highest package, top recruiters, and available courses
- Persisted in Zustand store across page navigations

### Authentication
- Credential-based sign-up with bcrypt password hashing (salt rounds: 12)
- Sign-in with email/password or Google OAuth
- Session managed by NextAuth with JWT strategy
- Protected routes redirect unauthenticated users to sign-in with a `callbackUrl`

---

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g., [Neon](https://neon.tech) free tier)
- A Google Gemini API key ([get one here](https://aistudio.google.com/))

### Environment Variables

Create a `.env` file at the root:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

GEMINI_API_KEY="..."
```

### Installation

```bash
# Install dependencies
npm install

# Push the schema to your database
npx prisma db push

# Seed with real college data
npx tsx prisma/seed.ts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

---

## Design Philosophy

The UI was built without component libraries, using Tailwind CSS v4 utility classes directly. The design language prioritizes:

- **Readability first** — High-contrast typography with consistent `slate` and primary color scales
- **Premium aesthetics** — Deep dark headers, rounded cards, layered shadows, and subtle micro-animations
- **Intentional UX** — Filters require explicit submission, AI analysis has clear loading states, and error conditions always show human-readable messages
- **Clean code** — No redundant comments; the codebase is self-documenting through descriptive naming and clear component structure

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/colleges` | List colleges with optional filters + pagination |
| `GET` | `/api/colleges/[slug]` | Get a single college by its URL slug |
| `GET` | `/api/colleges/compare?ids=...` | Get multiple colleges for comparison |
| `POST` | `/api/predictor` | Run AI prediction for college admission |
| `POST` | `/api/register` | Create a new user account |
| `GET` | `/api/saved` | Get current user's saved colleges |
| `POST` | `/api/saved` | Save a college to current user's list |
| `DELETE` | `/api/saved/[id]` | Remove a saved college |

---

## Submission Notes

This project was built for **Track B — College Discovery Platform** of the AI Software Engineer Internship Demo Task.

Features implemented:
- ✅ College Listing + Search (with filters and pagination)
- ✅ College Detail Page (overview, courses, placements, reviews)
- ✅ Compare Colleges (side-by-side, up to 3)
- ✅ AI Predictor Tool (Gemini-powered, rank/percentile input)
- ✅ Authentication + Saved Items (NextAuth, credential + Google OAuth)

---

*Built with Next.js, Prisma, Neon PostgreSQL, Google Gemini, and TailwindCSS.*
