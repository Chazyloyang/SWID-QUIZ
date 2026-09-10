# Generating a week's questions with AI

No coding needed — copy the prompt below into any AI chat (Claude, ChatGPT, etc.), fill in the three bracketed details at the top, and send it. The reply is a ready-to-paste code block: open your quiz file, find `const ALL_QUESTIONS = [...]`, and replace the whole array with what the AI gives you.

---

## Prompt to copy

```
I run weekly data-skills quizzes for a coding bootcamp. Write 10 multiple-choice
questions for this week's session as a JavaScript array in the EXACT format
below — no explanation, no markdown fences, just the code.

Session topic: [e.g. "Data Visualization with Matplotlib/Seaborn"]
Dataset used this session: [e.g. "World Happiness Report"]
Key concepts to cover: [e.g. "bar charts, line plots, subplots, choosing the
right chart type, labeling axes and titles"]

Rules:
- Exactly 10 questions, testing conceptual understanding — no starter code
  required to answer.
- Each question has exactly 4 options, exactly one with correct: true.
- Mix question difficulty: a few easy recall questions, several applied
  "what does this code do" or "which line is correct" questions, and 2-3
  business/scenario questions using the session's dataset.
- Assign each question a short "tag" naming the sub-topic (e.g. "Plotting",
  "Styling", "Business Questions").
- Write a correctFeedback string (1-2 sentences, explains WHY the answer is
  right) and a wrongFeedback string (1-2 sentences, states the correct
  answer and explains why) for every question.
- If a question needs a code snippet shown to the student, add a "code"
  field (a string); omit it otherwise.
- Escape any double quotes or backslashes inside strings correctly for
  valid JavaScript. Use \n inside a "question" string for a line break
  before a code reference, not literal newlines.

Output format — match this shape exactly:

const ALL_QUESTIONS = [
  {
    tag: "...",
    question: "...",
    code: "...",           // omit this line if not needed
    options: [
      { text: "...", correct: true  },
      { text: "...", correct: false },
      { text: "...", correct: false },
      { text: "...", correct: false }
    ],
    correctFeedback: "...",
    wrongFeedback: "..."
  },
  // ...9 more objects like this
];
```

## After you get the reply

1. Skim all 10 questions for accuracy — the AI can get technical details wrong, so check especially anything with exact code syntax.
2. Confirm each question has exactly one `correct: true`.
3. Open your week's quiz HTML file (duplicated from the template — see [SETUP.md](SETUP.md)), find the `const ALL_QUESTIONS = [` block, and replace it entirely with the new array.
4. Update the `CONFIG` object above it (title, subtitle, quiz name) to match the new session.
5. Open the file in a browser and click through all 10 questions once before sharing it, to confirm the feedback text and correct answers read the way you intended.
