RTT FULL MOBILE-FIRST REBRAND REPO
==================================

This is a full replace-all repo package.

It includes:
- mobile-first public UI
- rebrand from payout/money to status/competition
- token-based login
- admin dashboard
- live scoring
- player profile editing
- Supabase photo upload
- Vercel API proxy for Apps Script
- complete Apps Script Code.gs

IMPORTANT PUBLIC REBRAND
------------------------
Players -> Competitors
Matches -> Battles
Standings -> The Board
Skill -> Tier
Points -> Score
Money/payout language is hidden from public UI.

INSTALL WEBSITE
---------------
1. Unzip this package.
2. Open your GitHub repo folder.
3. Delete all existing files except .git.
4. Copy every file from this package into the repo.
5. Commit in GitHub Desktop.
6. Push.
7. Vercel redeploys.

VERCEL ENVIRONMENT VARIABLES
----------------------------
Keep/add these:

NEXT_PUBLIC_RTT_API_URL
https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec

NEXT_PUBLIC_GOOGLE_FORM_URL
https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform?usp=header

NEXT_PUBLIC_SUPABASE_URL
https://uegvfbcrzzsqegaafnwo.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Paste your Supabase anon public key

NEXT_PUBLIC_SUPABASE_PHOTO_BUCKET
player-photos

Do NOT use NEXT_PUBLIC_ADMIN_KEY anymore.

SUPABASE
--------
Storage bucket:
player-photos

Bucket should be public.

SQL policies:
create policy "Allow public player photo uploads"
on storage.objects
for insert
to anon
with check (bucket_id = 'player-photos');

create policy "Allow public player photo reads"
on storage.objects
for select
to anon
using (bucket_id = 'player-photos');

APPS SCRIPT
-----------
1. Open Apps Script.
2. Delete old duplicate .gs files if they define doGet or doPost.
3. Replace Code.gs with google-apps-script/Code.gs from this package.
4. Save.
5. Run runSetup.
6. Run syncFormToSystem.
7. Run recalcStandings.
8. Run setPayoutFromStandings.
9. Deploy > Manage deployments > Edit pencil > Version: New version > Deploy.
10. Web app must be:
    Execute as: Me
    Who has access: Anyone

DEFAULT ADMIN LOGIN
-------------------
Email:
admin@rttnyc.com

Password:
ChangeMeAdmin123!

Change password in the Users tab after install.

PLAYER LOGIN
------------
Create rows in Users tab:

userId | email | password | role | playerId
USR-002 | player@email.com | 1234 | player | PLY-001

TEST ORDER
----------
1. Open /api/rtt. It should show JSON.
2. Open /login.
3. Login as admin.
4. Go to /admin/matches.
5. Tap +1 and confirm /live updates.
6. Create a player account in Users tab.
7. Login as player and upload profile photo.
