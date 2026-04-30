const RTT_DEFAULT_FORM_URL = "https://forms.gle/p8wXpUG3paMnk6Fm9";

function setupRttApi(spreadsheetId, formUrl) {
  PropertiesService.getScriptProperties().setProperty("RTT_SPREADSHEET_ID", spreadsheetId);
  PropertiesService.getScriptProperties().setProperty("RTT_FORM_URL", formUrl || RTT_DEFAULT_FORM_URL);
}

function doGet(e) {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = props.getProperty("RTT_SPREADSHEET_ID");
  var formUrl = props.getProperty("RTT_FORM_URL") || RTT_DEFAULT_FORM_URL;

  if (!spreadsheetId) {
    return json_({
      error: "RTT_SPREADSHEET_ID not set. Run setupRttApi('YOUR_SHEET_ID', 'https://forms.gle/p8wXpUG3paMnk6Fm9').",
      formUrl: formUrl
    });
  }

  var ss = SpreadsheetApp.openById(spreadsheetId);

  return json_({
    updatedAt: new Date().toISOString(),
    formUrl: formUrl,
    players: getPlayers_(ss),
    matches: getMatches_(ss),
    weeklyResults: getWeeklyResults_(ss)
  });
}

function getPlayers_(ss) {
  var sh = ss.getSheetByName("Standings");
  if (!sh) return [];

  var values = sh.getDataRange().getValues();
  var rows = values.slice(1).filter(function(r) {
    return r[1] && r[2];
  });

  return rows.map(function(r, i) {
    var playerId = String(r[1]);

    return {
      rank: Number(r[0]) || i + 1,
      id: playerId,
      name: String(r[2] || ""),
      skill: String(r[3] || ""),
      wins: Number(r[5]) || 0,
      losses: Number(r[6]) || 0,
      points: Number(r[7]) || 0,
      gameDiff: 0,
      pointDiff: Number(r[10]) || 0,
      streak: String(r[12] || ""),
      handle: getPlayerField_(ss, playerId, 6) || "",
      photo: getPlayerField_(ss, playerId, 9) || ""
    };
  });
}

function getPlayerField_(ss, playerId, colNumber) {
  var sh = ss.getSheetByName("Players");
  if (!sh) return "";

  var values = sh.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === playerId) {
      return values[i][colNumber - 1] || "";
    }
  }

  return "";
}

function getMatches_(ss) {
  var sh = ss.getSheetByName("Matches");
  if (!sh) return [];

  var values = sh.getDataRange().getValues();

  return values
    .slice(1)
    .filter(function(r) {
      return r[1];
    })
    .slice(-25)
    .reverse()
    .map(function(r) {
      return {
        playerA: String(r[5] || ""),
        playerB: String(r[7] || ""),
        winner: String(r[11] || ""),
        score: String((r[8] || "") + "-" + (r[9] || "")),
        type: String(r[2] || "")
      };
    });
}

function getWeeklyResults_(ss) {
  var payout = ss.getSheetByName("Payouts");
  if (!payout) {
    return [{
      week: 1,
      winner: "TBD",
      players: 0,
      collected: 0,
      organizerCut: 0,
      prizePool: 0,
      first: 0,
      second: 0,
      third: 0
    }];
  }

  var eventId = payout.getRange("B2").getValue();

  return [{
    week: Number(String(eventId).replace(/[^0-9]/g, "")) || 1,
    winner: String(payout.getRange("C17").getValue() || "TBD"),
    players: Number(payout.getRange("B3").getValue()) || 0,
    collected: Number(payout.getRange("B5").getValue()) || 0,
    organizerCut: Number(payout.getRange("B6").getValue()) || 0,
    prizePool: Number(payout.getRange("B7").getValue()) || 0,
    first: Number(payout.getRange("B11").getValue()) || 0,
    second: Number(payout.getRange("B12").getValue()) || 0,
    third: Number(payout.getRange("B13").getValue()) || 0
  }];
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
