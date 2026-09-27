export const questions = [
  {
    language: "JavaScript",
    difficulty: "Easy",
    title: "The undefined profile",
    context: "A dashboard fails only for accounts created before the profile migration.",
    trace: `TypeError: Cannot read properties of undefined (reading 'name')
    at UserCard (src/components/UserCard.js:18:31)
    at renderWithHooks (react-dom.development.js:16305:18)

17 | return <article>
18 |   <h2>{user.profile.name}</h2>
19 | </article>`,
    answers: [
      "React rendered the component twice in development",
      "Legacy users can have no profile object",
      "The name property contains unsupported characters",
      "The component file uses the wrong extension",
    ],
    correct: 1,
    explanation: "The exception is about reading name from undefined, not about name itself. The cohort clue points to profile being absent on older records.",
    signal: "The first undefined boundary: user.profile",
  },
  {
    language: "Python",
    difficulty: "Medium",
    title: "The coroutine that never ran",
    context: "A FastAPI endpoint returns an object that cannot be serialized.",
    trace: `TypeError: 'coroutine' object is not iterable
  File "fastapi/encoders.py", line 152, in jsonable_encoder
  File "app/routes/users.py", line 41, in list_users

39 async def list_users():
40     users = repository.fetch_all()
41     return {"users": users}

RuntimeWarning: coroutine 'Repository.fetch_all' was never awaited`,
    answers: [
      "The query returned too many rows",
      "The repository method needs await",
      "The response must be converted to XML",
      "FastAPI does not support async route handlers",
    ],
    correct: 1,
    explanation: "The runtime warning names the exact coroutine. The route stored the coroutine object instead of awaiting its result.",
    signal: "'was never awaited' is the root-cause line",
  },
  {
    language: "PostgreSQL",
    difficulty: "Medium",
    title: "The migration lock",
    context: "A production migration waits until the deployment times out.",
    trace: `ERROR: canceling statement due to statement timeout
CONTEXT: while updating tuple (1821,7) in relation "orders"

ALTER TABLE orders
  ADD COLUMN status text DEFAULT 'pending' NOT NULL;

pg_stat_activity:
wait_event_type = 'Lock'
wait_event      = 'relation'`,
    answers: [
      "The new column name is reserved",
      "Another transaction holds a conflicting lock on orders",
      "The table has no primary key",
      "PostgreSQL cannot add text columns",
    ],
    correct: 1,
    explanation: "The database reports a relation lock wait. Find and resolve the blocking transaction before retrying the migration safely.",
    signal: "wait_event_type = Lock",
  },
  {
    language: "Node.js",
    difficulty: "Hard",
    title: "Headers after the response",
    context: "An API crashes only when the requested record does not exist.",
    trace: `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent
    at ServerResponse.setHeader (node:_http_outgoing:655:11)
    at res.json (express/lib/response.js:278:15)
    at getOrder (src/routes/orders.js:29:14)

24 | if (!order) {
25 |   res.status(404).json({ error: 'not found' });
26 | }
27 |
28 | audit(order);
29 | res.json(order);`,
    answers: [
      "The 404 response needs a return statement",
      "JSON responses cannot use status codes",
      "The audit function must run before the lookup",
      "Express needs two response objects",
    ],
    correct: 0,
    explanation: "Execution continues after sending the 404 and tries to send a second response. Return immediately after the first response.",
    signal: "Two response paths execute for the missing-record branch",
  },
  {
    language: "Git",
    difficulty: "Easy",
    title: "The rejected push",
    context: "A teammate pushed to the same branch while you were working.",
    trace: `! [rejected] feature/login -> feature/login (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes before pushing.`,
    answers: [
      "Delete the remote repository",
      "Force-push immediately",
      "Fetch and integrate the remote commits, then push",
      "Rename every local commit",
    ],
    correct: 2,
    explanation: "The remote contains commits you do not have. Fetch, inspect, and rebase or merge before pushing; a blind force-push risks losing work.",
    signal: "non-fast-forward means histories diverged",
  },
  {
    language: "TypeScript",
    difficulty: "Medium",
    title: "The impossible union",
    context: "A discriminated union stops narrowing after a refactor.",
    trace: `Property 'data' does not exist on type 'Result'.
  Property 'data' does not exist on type '{ ok: false; error: string; }'.

12 function render(result: Result) {
13   const { ok } = result;
14   if (ok) return result.data.name;
15   return result.error;
16 }`,
    answers: [
      "TypeScript cannot model success and error results",
      "The discriminator was widened or destructured in a way that lost correlation",
      "The data property must be renamed result",
      "The compiler requires a network connection",
    ],
    correct: 1,
    explanation: "Narrowing depends on a literal discriminator staying correlated with its object. Preserve the literal union and narrow directly on result.ok.",
    signal: "The error lists both members of the union",
  },
  {
    language: "Docker",
    difficulty: "Hard",
    title: "Works on localhost, fails in the container",
    context: "The web container cannot connect to the database container.",
    trace: `connect ECONNREFUSED 127.0.0.1:5432

services:
  web:
    environment:
      DATABASE_URL: postgresql://app:secret@localhost:5432/app
  db:
    image: postgres:16`,
    answers: [
      "PostgreSQL does not run in containers",
      "The web container should address the database by its service name",
      "Port 5432 only supports UDP",
      "The database URL needs an HTTPS scheme",
    ],
    correct: 1,
    explanation: "Inside the web container, localhost refers to that same container. Compose DNS exposes the database as db, so the host should be db:5432.",
    signal: "127.0.0.1 points back to the caller's container",
  },
  {
    language: "Python",
    difficulty: "Hard",
    title: "The mutable default",
    context: "Requests appear to inherit tags from earlier, unrelated requests.",
    trace: `def build_payload(user_id, tags=[]):
    tags.append("requested")
    return {"user_id": user_id, "tags": tags}

>>> build_payload(1)
{'user_id': 1, 'tags': ['requested']}
>>> build_payload(2)
{'user_id': 2, 'tags': ['requested', 'requested']}`,
    answers: [
      "Lists cannot be returned from functions",
      "The default list is created once and reused between calls",
      "The append method duplicates every string",
      "The user IDs should start at zero",
    ],
    correct: 1,
    explanation: "Mutable default arguments are allocated when the function is defined. Use None and create a fresh list inside the function.",
    signal: "State survives across separate function calls",
  },
];
