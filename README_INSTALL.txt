RTT FULL AUTH + PHOTO PRODUCTION RELEASE
========================================

This is a full replace-all package with:
- token-based login
- admin/player roles
- player profile editing
- player photo upload to Google Drive
- live scoring tap UI
- public live scoreboard
- mobile-safe pages
- complete Apps Script backend

DEFAULT ADMIN LOGIN
-------------------
Email:
admin@rttnyc.com

Password:
ChangeMeAdmin123!

Change this after install in the Users tab.

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

No NEXT_PUBLIC_ADMIN_KEY is required anymore.

INSTALL APPS SCRIPT
-------------------
1. Open Apps Script.
2. Delete old duplicate .gs files if they define doGet or doPost.
3. Replace Code.gs with google-apps-script/Code.gs from this package.
4. Save.
5. Run runSetup().
6. Run syncFormToSystem().
7. Run recalcStandings().
8. Deploy > Manage deployments > Edit > Deploy.

SHEET REQUIREMENT
-----------------
The backend creates a Users tab if missing.

Users tab columns:
userId | email | password | role | playerId

Admin example:
USR-001 | admin@rttnyc.com | ChangeMeAdmin123! | admin |

Player example:
USR-002 | player@email.com | 1234 | player | PLY-001

PLAYER FLOW
-----------
1. Player logs in at /login.
2. Player is sent to /players/[playerId]/edit.
3. Player can edit name, handle, and upload photo.
4. Photo saves to Google Drive folder: RTT Player Photos.
5. Photo URL is written to Players column I.

ADMIN FLOW
----------
1. Admin logs in at /login.
2. Admin lands on /admin/dashboard.
3. Admin can score live matches and sync/recalculate.

SECURITY
--------
Tokens are HMAC-signed and expire after 7 days.
Passwords are currently plain text in the Users sheet. Next recommended upgrade is password hashing.
