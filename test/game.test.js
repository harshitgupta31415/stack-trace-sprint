import test from "node:test";
import assert from "node:assert/strict";
import { answerQuestion, createGame, isComplete, nextQuestion, shuffle } from "../src/game.js";

const sample = [
  { difficulty: "Easy", answers: ["a", "b"], correct: 1 },
  { difficulty: "Hard", answers: ["a", "b"], correct: 0 },
];

test("awards points and grows a streak", () => {
  let state = createGame(sample);
  state = answerQuestion(state, 1);
  assert.equal(state.score, 100);
  assert.equal(state.streak, 1);
  state = nextQuestion(state);
  state = answerQuestion(state, 0);
  assert.equal(state.score, 270);
  assert.equal(state.streak, 2);
  assert.equal(state.correct, 2);
});

test("wrong answers reset the streak and cannot be repeated", () => {
  let state = createGame(sample);
  state = answerQuestion(state, 0);
  assert.equal(state.score, 0);
  assert.equal(state.streak, 0);
  assert.strictEqual(answerQuestion(state, 1), state);
});

test("completion is true only after the last answer", () => {
  let state = createGame(sample);
  state = answerQuestion(state, 1);
  assert.equal(isComplete(state), false);
  state = answerQuestion(nextQuestion(state), 0);
  assert.equal(isComplete(state), true);
});

test("shuffle is deterministic with an injected random source", () => {
  const values = [0.2, 0.8, 0.1];
  let index = 0;
  const result = shuffle([1, 2, 3, 4], () => values[index++]);
  assert.deepEqual(result, [2, 4, 3, 1]);
});
