# RTT NYC Website Starter

A deployable Next.js starter for the RTT NYC table tennis league.

## Includes

- Home page
- Play / signup page placeholder
- Standings page
- Results page
- Player directory
- Player profile pages with photos
- Rules page
- Admin starter pages for check-in, matches, and payouts
- Supabase SQL schema

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Copy your project URL and anon key.
5. Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

Update:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Go to Vercel.
3. Import the GitHub repo.
4. Add the two environment variables.
5. Deploy.

## Notes

The site currently uses mock data in `lib/mockData.ts`.
Next build step: replace mock data with Supabase queries and secure admin writes.
