/**
 * SWID Quiz results collector.
 *
 * Every quiz submission lands in the same spreadsheet, but on its own tab —
 * one tab per session (named after CONFIG.quizName from the quiz file), with
 * one row per student and one column per question. Retaking a quiz updates
 * that student's existing row instead of adding a duplicate.
 *
 * Setup: paste this into Extensions > Apps Script on the Google Sheet that
 * should collect results, then deploy as a Web App (see SETUP.md in this
 * folder for the full walkthrough).
 */
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sanitizeSheetName_(data.quizName))
    || ss.insertSheet(sanitizeSheetName_(data.quizName));

  var fixedCols = ["Timestamp", "Name", "Email", "Score", "Time Taken (s)"];
  var answers = data.answers || [];

  if (sheet.getLastRow() === 0) {
    var header = fixedCols.concat(answers.map(function (a, i) {
      return "Q" + (i + 1) + ": " + truncate_(cleanText_(a.question), 80);
    }));
    sheet.appendRow(header);
  } else if (answers.length > sheet.getLastColumn() - fixedCols.length) {
    // A later submission had more questions than the tab currently has columns for.
    var existingQCount = sheet.getLastColumn() - fixedCols.length;
    for (var i = existingQCount; i < answers.length; i++) {
      sheet.getRange(1, fixedCols.length + i + 1)
        .setValue("Q" + (i + 1) + ": " + truncate_(cleanText_(answers[i].question), 80));
    }
  }

  var row = [
    new Date(),
    data.name,
    data.email || "",
    data.score,
    data.timeTakenSeconds || ""
  ].concat(answers.map(function (a) { return a.correct ? "Correct" : "Incorrect"; }));

  var existingRow = findStudentRow_(sheet, data.name, data.email);
  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Finds the row (1-indexed) of an existing submission by this student on this
// tab, matching on Name + Email (both case-insensitive, trimmed). Returns
// null if this student hasn't submitted to this tab before.
function findStudentRow_(sheet, name, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  var existing = sheet.getRange(2, 2, lastRow - 1, 2).getValues(); // columns B (Name), C (Email)
  var key = normalize_(name) + "|" + normalize_(email);
  for (var i = 0; i < existing.length; i++) {
    if (normalize_(existing[i][0]) + "|" + normalize_(existing[i][1]) === key) {
      return i + 2;
    }
  }
  return null;
}

function normalize_(s) { return (s || "").toString().trim().toLowerCase(); }

function cleanText_(s) { return (s || "").toString().replace(/\s+/g, " ").trim(); }

function truncate_(s, n) { return s.length > n ? s.substring(0, n - 1) + "…" : s; }

// Google Sheets tab names: max 100 chars, can't contain [ ] * ? / \ : and can't be blank.
function sanitizeSheetName_(name) {
  var cleaned = (name || "Untitled Session").toString().replace(/[\[\]\*\?\/\\:]/g, "-").trim();
  return (cleaned.length ? cleaned : "Untitled Session").substring(0, 100);
}
