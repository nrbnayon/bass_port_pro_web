# Quick Hire Frontend

Modern job portal frontend built with Next.js, React, and TypeScript.

This app includes:
- Public landing pages and job browsing
- Authentication flows (sign in, sign up, forgot/reset password, OTP verification)
- Role-based dashboards (User/Admin)
- Admin job and application management views
- Reusable UI components with responsive layouts

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- Framer Motion
- Recharts
- Radix UI

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env` (or `.env.local`):

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Cloudinary (client-safe vars only)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

> Do not expose private secrets in frontend environment files. Keep server-only keys in the backend.

3. Run the dev server:

```bash
npm run dev
```

4. Open:

`http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```text
quick_hire_frontend/
├─ app/
│  ├─ (auth)/               # Auth routes
│  ├─ (roles)/              # Role-based route groups
│  ├─ api/                  # App-router API handlers
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ components/
│  ├─ Admin/
│  ├─ Auth/
│  ├─ Landing/
│  ├─ Shared/
│  ├─ Sidebar/
│  └─ ui/
├─ redux/
│  ├─ services/             # RTK Query API slices
│  ├─ features/
│  ├─ store.ts
│  └─ StoreProvider.tsx
├─ hooks/                   # Custom hooks
├─ lib/                     # Utilities and validators
├─ data/                    # Local demo/static data
├─ public/                  # Static files (icons/images/sw)
├─ types/                   # Shared TypeScript types
└─ next.config.ts
```

## API Integration

The frontend communicates with backend endpoints through RTK Query services in `redux/services`.

- Base URL comes from `NEXT_PUBLIC_API_URL`
- Auth, jobs, applications, and dashboard resources are fetched via centralized API slices

## Authentication & Roles

Current route organization supports:

- Public/guest pages
- Auth pages (`signin`, `signup`, password reset, OTP)
- Role-based dashboard areas under `app/(roles)`

Access logic is handled through shared permission utilities and role-aware components.

## Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Recommended Hosting

- Vercel (best for Next.js)
- Any Node.js host that supports Next.js server runtime

Before deployment, set production env values (especially `NEXT_PUBLIC_API_URL`) to your deployed backend URL.

## Troubleshooting

- If API requests fail in production, verify CORS and `NEXT_PUBLIC_API_URL`.
- If images fail, verify allowed image domains in `next.config.ts`.
- On Windows paths containing `&`, npm scripts can fail. Use PowerShell script shell:

```powershell
$env:npm_config_script_shell="$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
npm install
```

## Notes for Contributors

- Keep changes typed and lint-clean.
- Reuse shared UI primitives from `components/ui` and shared utilities.
- Prefer updating existing patterns over introducing new architecture for small features.
