"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const officialQuizScore = require("../src/session-scoring.js");
const shouldAddVariant = officialQuizScore.shouldAddVariant;
const skillSnapshot = officialQuizScore.skillSnapshot;

test("retry success does not overwrite a first-attempt mistake", () => {
  const qs = [{ firstRes: 0, res: 1 }, { firstRes: 1, res: 1 }];
  assert.deepEqual(officialQuizScore(qs), { tot: 2, c: 1 });
});

test("supplemental variant exercises do not affect official score", () => {
  const qs = [
    { firstRes: 1 },
    { firstRes: 0 },
    { isVariant: true, firstRes: 1 }
  ];
  assert.deepEqual(officialQuizScore(qs), { tot: 2, c: 1 });
});

test("unanswered official questions remain in total but not correct count", () => {
  const qs = [{ firstRes: 1 }, {}, { firstRes: 0 }];
  assert.deepEqual(officialQuizScore(qs), { tot: 3, c: 1 });
});

test("a fully correct first-attempt set is scored correctly", () => {
  assert.deepEqual(officialQuizScore([{ firstRes: 1 }, { firstRes: 1 }]), { tot: 2, c: 2 });
});

test("a successful retry earns a variant without changing the official score", () => {
  assert.equal(shouldAddVariant({ retryStage: 1, res: 1, q: { kp: 2, type: "mc" } }, []), true);
});

test("hint-assisted success gets a supportive follow-up, not a penalty", () => {
  assert.equal(shouldAddVariant({ firstRes: 1, hintUsed: true, q: { kp: 2, type: "mc" } }, []), true);
});

test("fast or ordinary unhinted success does not force extra practice without enough personal history", () => {
  assert.equal(shouldAddVariant({ firstRes: 1, hintUsed: false, firstTimeMs: 9000, q: { kp: 2, type: "mc" } }, []), false);
});

test("slow success is compared with the learner's own median for the same skill and question type", () => {
  const history = [10000, 11000, 12000, 13000, 14000].map(firstTimeMs => ({
    kp: 2, questionType: "mc", firstCorrect: true, hintUsed: false, firstTimeMs, variant: false
  }));
  const item = { firstRes: 1, hintUsed: false, firstTimeMs: 22000, q: { kp: 2, type: "mc" } };
  assert.equal(shouldAddVariant(item, history), true);
  item.firstTimeMs = 15000;
  assert.equal(shouldAddVariant(item, history), false);
});

test("variants and incorrect first attempts do not trigger variant chains", () => {
  assert.equal(shouldAddVariant({ isVariant: true, firstRes: 1, hintUsed: true, q: { kp: 2, type: "mc" } }, []), false);
  assert.equal(shouldAddVariant({ firstRes: 0, hintUsed: false, q: { kp: 2, type: "mc" } }, []), false);
});

test("skill mastery percentage uses the actual number of attempts", () => {
  assert.deepEqual(skillSnapshot([1]), { count: 1, percent: 100, status: "样本较少" });
  assert.deepEqual(skillSnapshot([1, 0, 0]), { count: 3, percent: 33, status: "优先巩固" });
  assert.deepEqual(skillSnapshot([1, 1, 0, 1]), { count: 4, percent: 75, status: "继续练习" });
});

test("unpracticed skills are not mistaken for zero-percent mastery", () => {
  assert.deepEqual(skillSnapshot([]), { count: 0, percent: 0, status: "未练习" });
});
