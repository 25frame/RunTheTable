/**
 * PREMIUM ADMIN WRITE PATCH
 *
 * Add this to Code.gs in Apps Script.
 *
 * SECTION PURPOSE
 * - This gives the Next.js admin portal permission to save live match scores.
 * - It validates ADMIN_KEY before writing to Google Sheets.
 * - It updates the Matches tab, recalculates standings, and updates payouts.
 */

const ADMIN_KEY = "rtt_Lx7jeZN05FlwPSG88PxUN7T41jJd";

function doPost(e) {
  const request = JSON.parse(e.postData.contents || "{}");

  if (request.key !== ADMIN_KEY) {
    return json_({ ok: false, error: "Unauthorized" });
  }

  if (request.action === "saveLiveMatch") {
    return json_(saveLiveMatch_(request.payload || {}));
  }

  return json_({ ok: false, error: "Unknown action" });
}

function saveLiveMatch_(payload) {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const matches = ss.getSheetByName("Matches");

  const row = Number(payload.row);
  const scoreA = Number(payload.scoreA) || 0;
  const scoreB = Number(payload.scoreB) || 0;

  if (!row || row < 2) {
    return { ok: false, error: "Invalid match row." };
  }

  const playerAId = String(matches.getRange(row, 5).getValue() || "");
  const playerA = String(matches.getRange(row, 6).getValue() || "");
  const playerBId = String(matches.getRange(row, 7).getValue() || "");
  const playerB = String(matches.getRange(row, 8).getValue() || "");

  const winnerId = scoreA > scoreB ? playerAId : playerBId;
  const winner = scoreA > scoreB ? playerA : playerB;

  matches.getRange(row, 9).setValue(scoreA);
  matches.getRange(row, 10).setValue(scoreB);
  matches.getRange(row, 11).setValue(winnerId);
  matches.getRange(row, 12).setValue(winner);
  matches.getRange(row, 13).setValue(true);
  matches.getRange(row, 14).setValue("Final saved from premium admin portal");

  recalcStandings();
  setPayoutFromStandings();

  return {
    ok: true,
    message: "Match saved.",
    winner: winner,
    score: scoreA + "-" + scoreB
  };
}
