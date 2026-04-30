/**
 * RTT API PATCH
 * Add this code to the SAME Apps Script project where you created the RTT Google Ops System.
 *
 * Then:
 * 1. Run setupRttApi("PASTE_SPREADSHEET_ID_HERE", "PASTE_FORM_URL_HERE")
 * 2. Deploy > New deployment > Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. Add it to Vercel as NEXT_PUBLIC_RTT_API_URL
 */

function setupRttApi(spreadsheetId, formUrl) {
  PropertiesService.getScriptProperties().setProperty("RTT_SPREADSHEET_ID", spreadsheetId);
  PropertiesService.getScriptProperties().setProperty("RTT_FORM_URL", formUrl || "");
}

function doGet(e) {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("RTT_SPREADSHEET_ID");
  const formUrl = props.getProperty("RTT_FORM_URL") || "";

  if (!spreadsheetId) {
    return json_({ error: "RTT_SPREADSHEET_ID not set. Run setupRttApi(spreadsheetId, formUrl)." });
  }

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const players = getPlayers_(ss);
  const matches = getMatches_(ss);
  const weeklyResults = getWeeklyResults_(ss);

  return json_({
    updatedAt: new Date().toISOString(),
    formUrl,
    players,
    matches,
    weeklyResults
  });
}

function getPlayers_(ss) {
  const sh = ss.getSheetByName("Standings");
  const values = sh.getDataRange().getValues();
  const rows = values.slice(1).filter(r => r[1] && r[2]);

  return rows.map((r, i) => ({
    rank: Number(r[0]) || i + 1,
    id: String(r[1]),
    name: String(r[2]),
    skill: String(r[3] || ""),
    wins: Number(r[5]) || 0,
    losses: Number(r[6]) || 0,
    points: Number(r[7]) || 0,
    gameDiff: 0,
    pointDiff: Number(r[10]) || 0,
    streak: String(r[12] || ""),
    handle: getPlayerField_(ss, String(r[1]), 6) || "",
    photo: getPlayerField_(ss, String(r[1]), 9) || ""
  }));
}

function getPlayerField_(ss, playerId, colNumber) {
  const sh = ss.getSheetByName("Players");
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === playerId) {
      return values[i][colNumber - 1];
    }
  }
  return "";
}

function getMatches_(ss) {
  const sh = ss.getSheetByName("Matches");
  const values = sh.getDataRange().getValues();
  return values.slice(1).filter(r => r[1]).slice(-25).reverse().map(r => ({
    playerA: String(r[5] || ""),
    playerB: String(r[7] || ""),
    winner: String(r[11] || ""),
    score: String((r[8] || "") + "-" + (r[9] || "")),
    type: String(r[2] || "")
  }));
}

function getWeeklyResults_(ss) {
  const payout = ss.getSheetByName("Payouts");
  const eventId = payout.getRange("B2").getValue();
  const paidPlayers = Number(payout.getRange("B3").getValue()) || 0;
  const collected = Number(payout.getRange("B5").getValue()) || 0;
  const organizerCut = Number(payout.getRange("B6").getValue()) || 0;
  const prizePool = Number(payout.getRange("B7").getValue()) || 0;
  const first = Number(payout.getRange("B11").getValue()) || 0;
  const second = Number(payout.getRange("B12").getValue()) || 0;
  const third = Number(payout.getRange("B13").getValue()) || 0;
  const firstName = payout.getRange("C17").getValue() || "TBD";

  return [{
    week: Number(String(eventId).replace(/[^0-9]/g, "")) || 1,
    winner: String(firstName),
    players: paidPlayers,
    collected,
    organizerCut,
    prizePool,
    first,
    second,
    third
  }];
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
