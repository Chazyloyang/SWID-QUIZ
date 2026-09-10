# SWID Quiz — Setup Guide

Two things to set up once, plus a short checklist for every new weekly quiz.

## 1. One-time: connect the results sheet

1. Create a new Google Sheet — name it something like **"SWID Cohort 3 Quiz Results"**. This one spreadsheet holds every week: each session automatically gets its own tab (named after that quiz's `quizName`), created the first time a submission for it comes in — you don't create tabs by hand.
2. In the Sheet, open **Extensions > Apps Script**.
3. Delete any starter code in `Code.gs` and paste in the contents of [Code.gs](Code.gs) from this folder.
4. Save the project (any name is fine, e.g. "SWID Quiz Backend").
5. Click **Deploy > New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy**, and authorize the script when prompted (it needs permission to write to the Sheet).
6. Copy the **Web app URL** it gives you — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

That URL is your `sheetEndpoint`. You'll paste it into every quiz file (step 2 below).

**If you ever edit `Code.gs` later:** use **Deploy > Manage deployments > Edit (pencil icon) > New version > Deploy**. This keeps the same URL, so you don't need to update every quiz file again. Only "New deployment" (not "Manage deployments") generates a brand-new URL.

## 2. Every new week: duplicate the quiz template

Use `SWID_Week6_Quiz_Source.html` as the template — duplicate it and rename for the new week (e.g. `SWID_Week7_Quiz.html`).

Open the new file and edit only the `CONFIG` object near the top of the `<script>` block:

```js
const CONFIG = {
  pageTitle:    "SWID Week 7 Quiz – <topic>",
  eyebrow:      "Solavise Women in Data · Week 7 · Saturday",
  titleHtml:    '<Session Title><br>with <span><Tool/Topic></span>',
  subtitle:     "10 questions · <short description>",
  quizName:     "Week 7 - <Session Title>",
  sheetEndpoint: "https://script.google.com/macros/s/PASTE_YOUR_DEPLOYMENT_ID/exec"
};
```

- `sheetEndpoint` only needs to be pasted in once per file — you can leave it as-is when copying an already-configured file to the next week.
- Replace the `ALL_QUESTIONS` array further down with that week's 10 questions. See [AI_QUESTION_PROMPT.md](AI_QUESTION_PROMPT.md) for a ready-to-use prompt that generates this array from an AI chat in the correct format — no manual JS writing required.
- Add one entry for the new file to the `WEEKS` array near the top of `index.html`'s `<script>` block, so it appears on the quiz list page. That's the only edit `index.html` ever needs.

## 3. Test before sharing

1. Open the quiz file in a browser, fill in a test name, and complete all 10 questions.
2. Check the Google Sheet — a new tab named after that quiz's `quizName` should appear, with one row for your test name showing the score and Correct/Incorrect per question.
3. Delete the test row, then share the quiz link (or the `index.html` list page) with participants.

## How the sheet is organized

- **One tab per session.** The tab name comes straight from `CONFIG.quizName` in the quiz file (e.g. "Week 7 - Data Visualization"). If two quiz files ever share the same `quizName`, they'll write into the same tab — keep each week's `quizName` unique.
- **One row per student, per tab.** Columns are `Timestamp, Name, Email, Score, Time Taken (s)`, then one column per question (headed with the question text) showing `Correct` / `Incorrect`.
- **Retakes overwrite, not duplicate.** If the same student (matched by name + email) submits the same quiz again, their existing row is updated in place rather than adding a second row — so a tab never has more than one row per student.
- **Cross-session view:** since every week is a tab in the same spreadsheet, you can open a student's row on each week's tab to track their performance across the cohort, or copy a summary row from each tab into a combined sheet if you want a single trend view.
