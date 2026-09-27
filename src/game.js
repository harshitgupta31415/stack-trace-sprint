export function createGame(questions) {
  return {
    questions: [...questions],
    index: 0,
    score: 0,
    streak: 0,
    answered: false,
    correct: 0,
  };
}

export function answerQuestion(state, answerIndex) {
  if (state.answered) return state;
  const question = state.questions[state.index];
  if (!question || answerIndex < 0 || answerIndex >= question.answers.length) return state;
  const isCorrect = answerIndex === question.correct;
  const streak = isCorrect ? state.streak + 1 : 0;
  const difficultyBonus = { Easy: 0, Medium: 25, Hard: 50 }[question.difficulty] ?? 0;
  const points = isCorrect ? 100 + difficultyBonus + Math.min(state.streak, 4) * 20 : 0;
  return {
    ...state,
    answered: true,
    selected: answerIndex,
    streak,
    correct: state.correct + Number(isCorrect),
    score: state.score + points,
  };
}

export function nextQuestion(state) {
  if (!state.answered || state.index >= state.questions.length - 1) return state;
  const { selected: _selected, ...rest } = state;
  return { ...rest, index: state.index + 1, answered: false };
}

export function isComplete(state) {
  return state.answered && state.index === state.questions.length - 1;
}

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}
