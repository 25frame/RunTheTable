# RUN THE TABLE / RTT NYC

Clean deployable Next.js build for Vercel + GitHub Desktop.

## What to copy into GitHub Desktop repo

Copy the CONTENTS of this folder into your repo root.

Your repo root should show:

- app/
- components/
- lib/
- public/
- package.json
- tailwind.config.ts
- tsconfig.json

Do NOT put Admin.html in the Next.js root. Admin.html belongs only in Apps Script.

## Deploy

1. Open GitHub Desktop.
2. Open your RunTheTable repo.
3. Delete old repo files if needed.
4. Copy this package's contents into the repo folder.
5. Commit.
6. Push.
7. Vercel deploys automatically.

## Google API

The site is currently hardcoded to use:

https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec

## Google Form

The signup button uses the form URL returned by the API, with fallback:

https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform?usp=header

## Admin Dashboard

Open the Admin page on the site, or use:

https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec?admin=1
