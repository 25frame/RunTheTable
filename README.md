# RUN THE TABLE / RTT NYC COMPLETE BUILD

Clean complete Next.js build with all required folders.

## Upload to GitHub

Use GitHub Desktop. Delete existing repo contents first, then copy this build's contents into repo root.

Repo root must show:
- app/
- components/
- lib/
- package.json

## Vercel

Framework: Next.js
Root Directory: ./
Node.js: 22.x recommended

## Environment Variables

Optional but recommended:
NEXT_PUBLIC_GOOGLE_FORM_URL
NEXT_PUBLIC_RTT_API_URL

Without them, the site builds with fallback sample data.
