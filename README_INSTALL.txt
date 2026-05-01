RTT NYC PRODUCTION SYSTEM
=========================

ADMIN PASSWORD / KEY
--------------------
rtt_vQWj1twDDrrciUqULZrRlEdRKjJKOQhRpnbs

INSTALL WEBSITE
---------------
1. Unzip this package.
2. Open your GitHub repo folder.
3. Delete all existing files except .git.
4. Copy all files from this package into the repo.
5. Commit in GitHub Desktop.
6. Push.
7. Vercel redeploys.

VERCEL ENVIRONMENT VARIABLES
----------------------------
NEXT_PUBLIC_RTT_API_URL
https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec

NEXT_PUBLIC_GOOGLE_FORM_URL
https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform?usp=header

NEXT_PUBLIC_ADMIN_KEY
rtt_vQWj1twDDrrciUqULZrRlEdRKjJKOQhRpnbs

INSTALL APPS SCRIPT
-------------------
1. Open Apps Script.
2. Delete old duplicate .gs files if they define doGet, doPost, RTT_SHEET_ID, or ADMIN_KEY.
3. Replace Code.gs with google-apps-script/Code.gs from this package.
4. Save.
5. Run runSetup.
6. Run syncFormToSystem.
7. Run recalcStandings.
8. Deploy > Manage deployments > Edit > Deploy.

ADMIN URL
---------
https://YOUR-VERCEL-DOMAIN/admin/login

LIVE SCORING
------------
1. Open /admin/matches.
2. Select match.
3. Tap +1 / -1.
4. Save Final Result when win by 2.
