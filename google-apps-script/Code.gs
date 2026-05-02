/**
 * RTT NYC FULL AUTH + PHOTO PRODUCTION BACKEND
 * ===========================================
 *
 * Complete Code.gs replacement.
 *
 * Includes:
 * - token-based login
 * - role-based admin/player permissions
 * - live scoring
 * - photo upload to Drive
 * - player profile update
 * - form sync, standings, payouts, public API
 */

const RTT_SHEET_ID = "1Dbdy4fiN8DUMBDuhxD3intZtzJWHGxMRgjsp8UBAStk";
const RTT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform?usp=header";
const FORM_RESPONSE_TAB = "Form Responses 1";
const AUTH_SECRET = "rtt_secret_8NEbv239rXSGOgo7EuJOHbjAJoOw9oFPHTxD2TIdxLUI3Zs3";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const PLAYER_PHOTO_FOLDER_NAME = "RTT Player Photos";

function runSetup() {
  PropertiesService.getScriptProperties().setProperty("RTT_SPREADSHEET_ID", RTT_SHEET_ID);
  ensureUsersSheet_();
}

function ensureUsersSheet_() {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  let sh = ss.getSheetByName("Users");
  if (!sh) sh = ss.insertSheet("Users");
  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,5).setValues([["userId","email","password","role","playerId"]]);
    sh.appendRow(["USR-001","admin@rttnyc.com","ChangeMeAdmin123!","admin",""]);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  syncFormToSystem();
  recalcStandings();
  setPayoutFromStandings();
  return json_({
    ok: true,
    updatedAt: new Date().toISOString(),
    formUrl: RTT_FORM_URL,
    players: getPlayersForSite_(ss),
    matches: getMatchesForSite_(ss),
    weeklyResults: getWeeklyResults_(ss),
    payout: getPayout_(ss)
  });
}

function doPost(e) {
  const request = JSON.parse(e.postData.contents || "{}");

  if (request.action === "login") {
    return json_(login_(request.payload || {}));
  }

  const user = verifyToken_(request.token);
  if (!user) return json_({ ok: false, error: "Unauthorized" });

  if (request.action === "saveLiveMatch") {
    if (user.role !== "admin") return json_({ ok: false, error: "Admin only" });
    return json_(saveLiveMatch_(request.payload || {}));
  }

  if (request.action === "updateLiveScore") {
    if (user.role !== "admin") return json_({ ok: false, error: "Admin only" });
    return json_(updateLiveScore_(request.payload || {}));
  }

  if (request.action === "syncForm") {
    if (user.role !== "admin") return json_({ ok: false, error: "Admin only" });
    return json_(syncFormToSystem());
  }

  if (request.action === "recalcStandings") {
    if (user.role !== "admin") return json_({ ok: false, error: "Admin only" });
    recalcStandings();
    setPayoutFromStandings();
    return json_({ ok: true, message: "Standings recalculated." });
  }

  if (request.action === "updatePlayerProfile") {
    if (user.role !== "player" && user.role !== "admin") return json_({ ok: false, error: "Unauthorized" });
    return json_(updatePlayerProfile_(request.payload || {}, user));
  }

  if (request.action === "uploadPlayerPhoto") {
    if (user.role !== "player" && user.role !== "admin") return json_({ ok: false, error: "Unauthorized" });
    return json_(uploadPlayerPhoto_(request.payload || {}, user));
  }

  return json_({ ok: false, error: "Unknown action" });
}

function login_(payload) {
  ensureUsersSheet_();
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const users = ss.getSheetByName("Users").getDataRange().getValues();
  const email = String(payload.email || "").toLowerCase().trim();
  const password = String(payload.password || "");
  for (let i = 1; i < users.length; i++) {
    if (String(users[i][1]).toLowerCase().trim() === email && String(users[i][2]) === password) {
      const user = { userId: String(users[i][0]), email: String(users[i][1]).toLowerCase(), role: String(users[i][3]), playerId: String(users[i][4] || "") };
      return { ok: true, token: createToken_(user), user: user };
    }
  }
  return { ok: false, error: "Invalid login" };
}

function createToken_(user) {
  const payload = { userId: user.userId, email: user.email, role: user.role, playerId: user.playerId || "", exp: Date.now() + TOKEN_TTL_MS };
  const payloadStr = JSON.stringify(payload);
  const signature = Utilities.base64Encode(Utilities.computeHmacSha256Signature(payloadStr, AUTH_SECRET));
  return Utilities.base64Encode(payloadStr) + "." + signature;
}

function verifyToken_(token) {
  if (!token) return null;
  const parts = String(token).split(".");
  if (parts.length !== 2) return null;
  try {
    const payloadStr = Utilities.newBlob(Utilities.base64Decode(parts[0])).getDataAsString();
    const expectedSig = Utilities.base64Encode(Utilities.computeHmacSha256Signature(payloadStr, AUTH_SECRET));
    if (expectedSig !== parts[1]) return null;
    const payload = JSON.parse(payloadStr);
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

function updatePlayerProfile_(payload, user) {
  const playerId = String(payload.playerId || "");
  if (!playerId) return { ok: false, error: "Missing playerId." };
  if (user.role !== "admin" && user.playerId !== playerId) return { ok: false, error: "Forbidden." };
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const sheet = ss.getSheetByName("Players");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === playerId) {
      const row = i + 1;
      if (payload.name) sheet.getRange(row, 2).setValue(payload.name);
      if (payload.instagram) sheet.getRange(row, 6).setValue(payload.instagram);
      if (payload.photo) sheet.getRange(row, 9).setValue(payload.photo);
      return { ok: true, playerId: playerId };
    }
  }
  return { ok: false, error: "Player not found." };
}

function uploadPlayerPhoto_(payload, user) {
  const playerId = String(payload.playerId || "");
  if (!playerId) return { ok: false, error: "Missing playerId." };
  if (user.role !== "admin" && user.playerId !== playerId) return { ok: false, error: "Forbidden." };
  const filename = safeFilename_(payload.filename || "profile-photo.jpg");
  const mimeType = String(payload.mimeType || "image/jpeg");
  const base64 = String(payload.base64 || "");
  if (!base64) return { ok: false, error: "Missing image data." };
  const folder = getOrCreateFolder_(PLAYER_PHOTO_FOLDER_NAME);
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mimeType, playerId + "-" + Date.now() + "-" + filename);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const fileId = file.getId();
  const photoUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
  const result = updatePlayerPhotoUrl_(playerId, photoUrl);
  if (!result.ok) return result;
  return { ok: true, playerId: playerId, photoUrl: photoUrl, fileId: fileId };
}

function updatePlayerPhotoUrl_(playerId, photoUrl) {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const sheet = ss.getSheetByName("Players");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === playerId) {
      sheet.getRange(i + 1, 9).setValue(photoUrl);
      return { ok: true };
    }
  }
  return { ok: false, error: "Player not found." };
}

function updateLiveScore_(payload) {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const matches = ss.getSheetByName("Matches");
  const row = Number(payload.row);
  const scoreA = Number(payload.scoreA) || 0;
  const scoreB = Number(payload.scoreB) || 0;
  if (!matches) return { ok: false, error: "Missing Matches tab." };
  if (!row || row < 2) return { ok: false, error: "Invalid match row." };
  matches.getRange(row, 9).setValue(scoreA);
  matches.getRange(row, 10).setValue(scoreB);
  matches.getRange(row, 13).setValue(false);
  matches.getRange(row, 14).setValue("Live");
  return { ok: true, message: "Live score updated.", score: scoreA + "-" + scoreB };
}

function saveLiveMatch_(payload) {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const matches = ss.getSheetByName("Matches");
  const row = Number(payload.row);
  const scoreA = Number(payload.scoreA) || 0;
  const scoreB = Number(payload.scoreB) || 0;
  if (!matches) return { ok: false, error: "Missing Matches tab." };
  if (!row || row < 2) return { ok: false, error: "Invalid match row." };
  const playerAId = val_(matches.getRange(row, 5).getValue());
  const playerA = val_(matches.getRange(row, 6).getValue());
  const playerBId = val_(matches.getRange(row, 7).getValue());
  const playerB = val_(matches.getRange(row, 8).getValue());
  const winnerId = scoreA > scoreB ? playerAId : playerBId;
  const winner = scoreA > scoreB ? playerA : playerB;
  matches.getRange(row, 9).setValue(scoreA);
  matches.getRange(row, 10).setValue(scoreB);
  matches.getRange(row, 11).setValue(winnerId);
  matches.getRange(row, 12).setValue(winner);
  matches.getRange(row, 13).setValue(true);
  matches.getRange(row, 14).setValue("Final");
  recalcStandings();
  setPayoutFromStandings();
  return { ok: true, message: "Match saved.", winner: winner, score: scoreA + "-" + scoreB };
}

function syncFormToSystem() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
    const formSheet = ss.getSheetByName(FORM_RESPONSE_TAB);
    const playersSheet = ss.getSheetByName("Players");
    const regSheet = ss.getSheetByName("Registrations");
    const setupSheet = ss.getSheetByName("Setup");
    if (!formSheet || !playersSheet || !regSheet || !setupSheet) return { ok: true, warning: "Required tab missing; sync skipped." };
    const activeEventId = String(setupSheet.getRange("B9").getValue() || "EVT-001").trim();
    const formRows = formSheet.getDataRange().getValues();
    const playerRows = playersSheet.getDataRange().getValues();
    const regRows = regSheet.getDataRange().getValues();
    const playerIndex = buildPlayerIndex_(playerRows);
    const regIndex = buildRegistrationIndex_(regRows);
    let addedPlayers = 0, updatedPlayers = 0, addedRegistrations = 0;
    for (let i = 1; i < formRows.length; i++) {
      const row = formRows[i];
      const fullName = val_(row[1]);
      const displayName = val_(row[2]) || fullName;
      const email = normalizeEmail_(row[3]);
      const phone = val_(row[4]);
      const instagram = val_(row[5]);
      const skill = val_(row[6]) || "Beginner";
      const paymentHandle = val_(row[7]);
      const notes = val_(row[8]);
      const photoUrl = val_(row[9]);
      if (!displayName && !email) continue;
      let found = findExistingPlayer_(playerIndex, email, displayName, fullName);
      let playerId = "";
      if (found) {
        playerId = found.id;
        playersSheet.getRange(found.rowNumber, 2).setValue(displayName);
        playersSheet.getRange(found.rowNumber, 3).setValue(fullName);
        playersSheet.getRange(found.rowNumber, 4).setValue(email);
        playersSheet.getRange(found.rowNumber, 5).setValue(phone);
        playersSheet.getRange(found.rowNumber, 6).setValue(instagram);
        playersSheet.getRange(found.rowNumber, 7).setValue(skill);
        playersSheet.getRange(found.rowNumber, 8).setValue(paymentHandle);
        if (photoUrl) playersSheet.getRange(found.rowNumber, 9).setValue(photoUrl);
        playersSheet.getRange(found.rowNumber, 10).setValue("Active");
        updatedPlayers++;
      } else {
        playerId = nextPlayerId_(playerRows);
        playersSheet.appendRow([playerId, displayName, fullName, email, phone, instagram, skill, paymentHandle, photoUrl, "Active", new Date()]);
        addedPlayers++;
        const newRowNumber = playersSheet.getLastRow();
        const newPlayer = { id: playerId, rowNumber: newRowNumber, email: email, displayName: norm_(displayName), fullName: norm_(fullName) };
        playerIndex.players.push(newPlayer);
        if (email) playerIndex.byEmail[email] = newPlayer;
        if (displayName) playerIndex.byDisplay[norm_(displayName)] = newPlayer;
        if (fullName) playerIndex.byFull[norm_(fullName)] = newPlayer;
        playerRows.push([playerId, displayName, fullName, email, phone, instagram, skill, paymentHandle, photoUrl, "Active", new Date()]);
      }
      const regKey = activeEventId + "|" + playerId;
      if (!regIndex.has(regKey)) {
        regSheet.appendRow([activeEventId, playerId, displayName, skill, false, false, 0, "", "", "Registered", notes, new Date()]);
        regIndex.add(regKey);
        addedRegistrations++;
      }
    }
    recalcStandings();
    setPayoutFromStandings();
    return { ok: true, addedPlayers: addedPlayers, updatedPlayers: updatedPlayers, addedRegistrations: addedRegistrations };
  } finally {
    lock.releaseLock();
  }
}

function buildPlayerIndex_(rows) {
  const index = { players: [], byEmail: {}, byDisplay: {}, byFull: {} };
  for (let i = 1; i < rows.length; i++) {
    const id = val_(rows[i][0]);
    if (!id) continue;
    const player = { id: id, rowNumber: i + 1, displayName: norm_(rows[i][1]), fullName: norm_(rows[i][2]), email: normalizeEmail_(rows[i][3]) };
    index.players.push(player);
    if (player.email) index.byEmail[player.email] = player;
    if (player.displayName) index.byDisplay[player.displayName] = player;
    if (player.fullName) index.byFull[player.fullName] = player;
  }
  return index;
}
function findExistingPlayer_(index, email, displayName, fullName) {
  const e = normalizeEmail_(email), d = norm_(displayName), f = norm_(fullName);
  if (e && index.byEmail[e]) return index.byEmail[e];
  if (d && index.byDisplay[d]) return index.byDisplay[d];
  if (f && index.byFull[f]) return index.byFull[f];
  return null;
}
function buildRegistrationIndex_(rows) {
  const set = new Set();
  for (let i = 1; i < rows.length; i++) {
    const eventId = val_(rows[i][0]), playerId = val_(rows[i][1]);
    if (eventId && playerId) set.add(eventId + "|" + playerId);
  }
  return set;
}
function nextPlayerId_(playersData) {
  let max = 0;
  for (let i = 1; i < playersData.length; i++) {
    const num = Number(String(playersData[i][0] || "").replace(/[^0-9]/g, ""));
    if (num > max) max = num;
  }
  return "PLY-" + String(max + 1).padStart(3, "0");
}

function recalcStandings() {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID);
  const playersSheet = ss.getSheetByName("Players"), matchesSheet = ss.getSheetByName("Matches"), standingsSheet = ss.getSheetByName("Standings"), setupSheet = ss.getSheetByName("Setup");
  if (!playersSheet || !matchesSheet || !standingsSheet) return;
  const playersData = playersSheet.getDataRange().getValues();
  const matchesData = matchesSheet.getDataRange().getValues();
  const winPoints = setupSheet ? Number(setupSheet.getRange("B11").getValue()) || 3 : 3;
  const lossPoints = setupSheet ? Number(setupSheet.getRange("B12").getValue()) || 1 : 1;
  const stats = {};
  playersData.slice(1).forEach(function(row) {
    const id = val_(row[0]); if (!id) return;
    stats[id] = { id: id, name: val_(row[1]), skill: val_(row[6]), matches: 0, wins: 0, losses: 0, points: 0, pointsFor: 0, pointsAgainst: 0, pointDiff: 0, winPct: 0, streak: "" };
  });
  matchesData.slice(1).forEach(function(row) {
    const playerAId = val_(row[4]), playerBId = val_(row[6]), scoreA = Number(row[8]) || 0, scoreB = Number(row[9]) || 0, winnerId = val_(row[10]);
    const verified = row[12] === true || String(row[12]).toUpperCase() === "TRUE";
    if (!verified || !stats[playerAId] || !stats[playerBId] || (!scoreA && !scoreB)) return;
    stats[playerAId].matches++; stats[playerBId].matches++;
    stats[playerAId].pointsFor += scoreA; stats[playerAId].pointsAgainst += scoreB;
    stats[playerBId].pointsFor += scoreB; stats[playerBId].pointsAgainst += scoreA;
    if (winnerId === playerAId) { stats[playerAId].wins++; stats[playerBId].losses++; }
    else if (winnerId === playerBId) { stats[playerBId].wins++; stats[playerAId].losses++; }
  });
  const rows = Object.keys(stats).map(function(id) { const s = stats[id]; s.points = s.wins * winPoints + s.losses * lossPoints; s.pointDiff = s.pointsFor - s.pointsAgainst; s.winPct = s.matches ? s.wins / s.matches : 0; return s; }).sort(function(a,b) { return b.points - a.points || b.wins - a.wins || b.pointDiff - a.pointDiff || a.name.localeCompare(b.name); });
  standingsSheet.clearContents();
  standingsSheet.getRange(1,1,1,13).setValues([["Rank","Player ID","Display Name","Skill Level","Matches","Wins","Losses","Points","For","Against","Point Diff","Win %","Streak / Notes"]]);
  if (rows.length) {
    standingsSheet.getRange(2,1,rows.length,13).setValues(rows.map(function(s,i) { return [i+1,s.id,s.name,s.skill,s.matches,s.wins,s.losses,s.points,s.pointsFor,s.pointsAgainst,s.pointDiff,s.winPct,s.streak]; }));
    standingsSheet.getRange(2,12,rows.length,1).setNumberFormat("0%");
  }
}

function setPayoutFromStandings() {
  const ss = SpreadsheetApp.openById(RTT_SHEET_ID), standings = getStandings_(ss), payouts = ss.getSheetByName("Payouts");
  if (!payouts) return;
  payouts.getRange("B17:F19").setValues([
    [standings[0] ? standings[0].id : "", standings[0] ? standings[0].name : "", payouts.getRange("B11").getValue() || 0, false, ""],
    [standings[1] ? standings[1].id : "", standings[1] ? standings[1].name : "", payouts.getRange("B12").getValue() || 0, false, ""],
    [standings[2] ? standings[2].id : "", standings[2] ? standings[2].name : "", payouts.getRange("B13").getValue() || 0, false, ""]
  ]);
}
function getPlayersForSite_(ss) {
  const standings = getStandings_(ss), playerMap = getPlayerMap_(ss);
  return standings.map(function(s) { const p = playerMap[s.id] || {}; return { rank: s.rank, id: s.id, name: s.name, skill: s.skill, wins: s.wins, losses: s.losses, points: s.points, gameDiff: 0, pointDiff: s.pointDiff, streak: s.streak, handle: p.instagram || "", photo: p.photo || "" }; });
}
function getStandings_(ss) {
  const sh = ss.getSheetByName("Standings"); if (!sh) return [];
  const values = sh.getDataRange().getValues();
  return values.slice(1).filter(function(r) { return r[1] && r[2]; }).map(function(r) { return { rank: Number(r[0]) || 0, id: val_(r[1]), name: val_(r[2]), skill: val_(r[3]), matches: Number(r[4]) || 0, wins: Number(r[5]) || 0, losses: Number(r[6]) || 0, points: Number(r[7]) || 0, pointsFor: Number(r[8]) || 0, pointsAgainst: Number(r[9]) || 0, pointDiff: Number(r[10]) || 0, winPct: r[11] || 0, streak: val_(r[12]) }; });
}
function getPlayerMap_(ss) {
  const sh = ss.getSheetByName("Players"); if (!sh) return {};
  const values = sh.getDataRange().getValues(), map = {};
  values.slice(1).forEach(function(r) { const id = val_(r[0]); if (!id) return; map[id] = { displayName: val_(r[1]), fullName: val_(r[2]), email: val_(r[3]), phone: val_(r[4]), instagram: val_(r[5]), skill: val_(r[6]), paymentHandle: val_(r[7]), photo: val_(r[8]), status: val_(r[9]) }; });
  return map;
}
function getMatchesForSite_(ss) {
  const sh = ss.getSheetByName("Matches"); if (!sh) return [];
  const values = sh.getDataRange().getValues();
  return values.slice(1).filter(function(r) { return r[1]; }).map(function(r,idx) { return { row: idx + 2, eventId: val_(r[0]), matchId: val_(r[1]), type: val_(r[2]), table: val_(r[3]), playerAId: val_(r[4]), playerA: val_(r[5]), playerBId: val_(r[6]), playerB: val_(r[7]), scoreA: Number(r[8]) || 0, scoreB: Number(r[9]) || 0, winnerId: val_(r[10]), winner: val_(r[11]), verified: r[12] === true || String(r[12]).toUpperCase() === "TRUE", status: val_(r[13]) || (r[12] === true ? "Final" : "Scheduled"), score: String((r[8] || 0) + "-" + (r[9] || 0)) }; }).reverse();
}
function getWeeklyResults_(ss) { const payout = getPayout_(ss); return [{ week: payout.week, winner: payout.firstPlaceName || "TBD", players: payout.paidPlayers, collected: payout.totalCollected, organizerCut: payout.operationsCut, prizePool: payout.prizePool, first: payout.firstPlacePayout, second: payout.secondPlacePayout, third: payout.thirdPlacePayout }]; }
function getPayout_(ss) {
  const sh = ss.getSheetByName("Payouts");
  if (!sh) return { eventId: "EVT-001", week: 1, paidPlayers: 0, totalCollected: 0, operationsCut: 0, prizePool: 0, firstPlaceName: "TBD", firstPlacePayout: 0, secondPlacePayout: 0, thirdPlacePayout: 0 };
  const eventId = val_(sh.getRange("B2").getValue()) || "EVT-001";
  return { eventId: eventId, week: Number(eventId.replace(/[^0-9]/g, "")) || 1, paidPlayers: Number(sh.getRange("B3").getValue()) || 0, totalCollected: Number(sh.getRange("B5").getValue()) || 0, operationsCut: Number(sh.getRange("B6").getValue()) || 0, prizePool: Number(sh.getRange("B7").getValue()) || 0, firstPlaceName: val_(sh.getRange("C17").getValue()) || "TBD", firstPlacePayout: Number(sh.getRange("B11").getValue()) || 0, secondPlacePayout: Number(sh.getRange("B12").getValue()) || 0, thirdPlacePayout: Number(sh.getRange("B13").getValue()) || 0 };
}
function getOrCreateFolder_(folderName) { const folders = DriveApp.getFoldersByName(folderName); if (folders.hasNext()) return folders.next(); return DriveApp.createFolder(folderName); }
function safeFilename_(name) { return String(name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100); }
function val_(v) { return String(v || "").trim(); }
function norm_(v) { return val_(v).toLowerCase().replace(/\s+/g, " "); }
function normalizeEmail_(v) { return val_(v).toLowerCase(); }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
