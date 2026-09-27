# Stack Trace Sprint

A zero-build browser game for practising real-world debugging decisions.

Players work through eight short incidents across JavaScript, Python,
TypeScript, PostgreSQL, Git, Docker, and Node.js. Every answer explains the
root cause and highlights the most useful signal in the trace.

## Features

- Realistic traces and failure contexts instead of syntax trivia
- Difficulty and streak-based scoring
- Accuracy-based result ranks from Log Explorer to Incident Commander
- Keyboard controls (`1`–`4`, then `Enter`)
- Persistent best score and theme preference using local storage
- Responsive light and dark themes
- Accessible labels, focus states, live feedback, and reduced-motion support
- No framework, account, analytics, or backend

## Run locally

Open `index.html`, or use any static server:

```bash
npx serve .
```

Then visit the printed local URL.

## Test

The scoring and state transitions are separated from the DOM and tested with
Node's built-in test runner.

```bash
npm test
npm run check
```

## Add an incident

Add one object to `src/questions.js` with:

- the language and difficulty;
- a short production context;
- a trace or focused code excerpt;
- four plausible answers;
- the correct answer index;
- an explanation and the signal a developer should notice.

Keep the scenario specific enough to teach a reusable debugging habit.

## License

MIT
