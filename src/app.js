import { answerQuestion, createGame, isComplete, nextQuestion, shuffle } from "./game.js";
import { questions } from "./questions.js";

const elements = Object.fromEntries(
  [
    "progress", "score", "streak", "best", "language", "scenario-title",
    "difficulty", "context", "trace", "answers", "feedback", "feedback-title",
    "explanation", "signal", "next", "challenge", "results", "results-copy",
    "restart", "theme-toggle",
  ].map((id) => [id, document.getElementById(id)]),
);

const storage = {
  read(key, fallback) {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, String(value)); } catch { /* private mode */ }
  },
};

let state = createGame(shuffle(questions));
let best = Number(storage.read("stack-trace-sprint-best", "0"));

function renderQuestion() {
  const question = state.questions[state.index];
  elements.progress.textContent = `${state.index + 1} / ${state.questions.length}`;
  elements.score.textContent = state.score;
  elements.streak.textContent = state.streak;
  elements.best.textContent = best;
  elements.language.textContent = question.language;
  elements["scenario-title"].textContent = question.title;
  elements.difficulty.textContent = question.difficulty;
  elements.context.textContent = question.context;
  elements.trace.textContent = question.trace;
  elements.feedback.hidden = true;
  elements.next.disabled = true;
  elements.next.textContent = state.index === state.questions.length - 1 ? "See results" : "Next incident";

  elements.answers.replaceChildren();
  const legend = document.createElement("legend");
  legend.textContent = "What is the most likely root cause?";
  elements.answers.append(legend);

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.dataset.answer = index;
    button.innerHTML = `<span class="answer-key">${index + 1}</span><span></span>`;
    button.lastElementChild.textContent = answer;
    button.addEventListener("click", () => choose(index));
    elements.answers.append(button);
  });
}

function choose(index) {
  if (state.answered) return;
  state = answerQuestion(state, index);
  const question = state.questions[state.index];
  const buttons = [...elements.answers.querySelectorAll("button")];
  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === question.correct) button.classList.add("correct");
    if (buttonIndex === index && index !== question.correct) button.classList.add("incorrect");
  });

  const correct = index === question.correct;
  elements["feedback-title"].textContent = correct ? "Correct diagnosis" : "Look one frame closer";
  elements.explanation.textContent = question.explanation;
  elements.signal.textContent = question.signal;
  elements.feedback.hidden = false;
  elements.next.disabled = false;
  elements.score.textContent = state.score;
  elements.streak.textContent = state.streak;

  if (state.score > best) {
    best = state.score;
    storage.write("stack-trace-sprint-best", best);
    elements.best.textContent = best;
  }
}

function advance() {
  if (!state.answered) return;
  if (isComplete(state)) {
    elements.challenge.hidden = true;
    elements.results.hidden = false;
    elements["results-copy"].textContent = `You diagnosed ${state.correct} of ${state.questions.length} incidents and scored ${state.score} points.`;
    elements.restart.focus();
    return;
  }
  state = nextQuestion(state);
  renderQuestion();
  elements["scenario-title"].focus?.();
}

function restart() {
  state = createGame(shuffle(questions));
  elements.results.hidden = true;
  elements.challenge.hidden = false;
  renderQuestion();
  elements.challenge.scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements["theme-toggle"].textContent = theme === "dark" ? "☀" : "☾";
  elements["theme-toggle"].setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  storage.write("stack-trace-sprint-theme", theme);
}

elements.next.addEventListener("click", advance);
elements.restart.addEventListener("click", restart);
elements["theme-toggle"].addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
document.addEventListener("keydown", (event) => {
  if (!state.answered && /^[1-4]$/.test(event.key)) choose(Number(event.key) - 1);
  else if (state.answered && event.key === "Enter") advance();
});

applyTheme(storage.read("stack-trace-sprint-theme", "dark"));
renderQuestion();
