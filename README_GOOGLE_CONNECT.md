# Connect RTT Website to Google Sheet / Form

This version connects the website to your Google Ops Sheet using an Apps Script Web App JSON endpoint.

## Step 1: Add the API patch to Apps Script

1. Open the Apps Script project you used for the RTT Google Ops System.
2. Add a new file named `RTT_API_PATCH.gs`.
3. Paste the contents of `google-apps-script/RTT_API_PATCH.gs`.
4. Save.

## Step 2: Get your Spreadsheet ID

Open the RTT Google Sheet. The URL looks like:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

Copy the long ID between `/d/` and `/edit`.

## Step 3: Run setupRttApi

In Apps Script, run:

```js
setupRttApi("PASTE_SPREADSHEET_ID_HERE", "PASTE_GOOGLE_FORM_URL_HERE")
```

Authorize if asked.

## Step 4: Deploy as Web App

1. Click Deploy.
2. New deployment.
3. Select type: Web app.
4. Execute as: Me.
5. Who has access: Anyone.
6. Deploy.
7. Copy the Web App URL.

## Step 5: Add Vercel Environment Variables

In Vercel > Project > Settings > Environment Variables, add:

```bash
NEXT_PUBLIC_GOOGLE_FORM_URL=your_google_form_url
NEXT_PUBLIC_RTT_API_URL=your_apps_script_web_app_url
```

Redeploy.

## What becomes live

- Join buttons open your Google Form.
- Home page top players pull from the Google Sheet.
- Standings pull from the Google Sheet.
- Players pull from the Google Sheet.
- Results pull from the Google Sheet.
- Player profile pages pull from the Google Sheet.

## Important

Admin operations still happen in Google Sheets. That is intentional for now because it is faster and safer for launch.
