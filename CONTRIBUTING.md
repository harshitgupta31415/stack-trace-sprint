# Contributing to Stack Trace Sprint

New incidents and accessibility improvements are especially welcome.

## Local checks

```bash
npm test
npm run check
```

An incident should teach a reusable debugging habit, provide four plausible choices, and explain the strongest signal in the trace. Do not use production secrets, private logs, or examples copied from a real incident without permission. Keep questions concise enough to work on a mobile screen.

UI changes must remain keyboard accessible, respect reduced-motion preferences, and work in both themes. The application stays build-free and does not add analytics or network tracking.
