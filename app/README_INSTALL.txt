RUN THE TABLE PREMIUM SYSTEM

ADMIN PASSWORD / KEY
rtt_Lx7jeZN05FlwPSG88PxUN7T41jJd

WHAT THIS PACKAGE ADDS

1. Premium public Live Scores page:
   /live

2. Premium private Admin pages:
   /admin/login
   /admin/dashboard
   /admin/matches

3. Mobile-first live scoring:
   +1 / -1 buttons
   winner detection at 11, win by 2
   Save Final Result
   writes to Matches sheet
   recalculates standings and payouts

4. Better mobile navigation:
   Live page appears in nav
   Admin removed from public nav

INSTALL INTO GITHUB DESKTOP

1. Unzip this package.
2. Open your GitHub repo folder.
3. Delete old website files.
4. Copy this package contents into the repo folder.
5. Commit in GitHub Desktop.
6. Push.
7. Vercel redeploys.

VERCEL ENVIRONMENT VARIABLES

Add or confirm:

NEXT_PUBLIC_RTT_API_URL
https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec

NEXT_PUBLIC_GOOGLE_FORM_URL
https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform

NEXT_PUBLIC_ADMIN_KEY
rtt_Lx7jeZN05FlwPSG88PxUN7T41jJd

APPS SCRIPT STEP

Open:
google-apps-script/PREMIUM_DOPOST_PATCH.gs

Copy that code into your Apps Script Code.gs.

If you already have a doPost(e), replace the old one with the new doPost(e).

Then:
1. Save Apps Script.
2. Deploy > Manage deployments > Edit.
3. Deploy.
4. Test /admin/login.

SECURITY NOTE

The public website reads data from Apps Script.
Admin writes are protected by ADMIN_KEY in Apps Script doPost(e).
Do not share the admin password/key.
