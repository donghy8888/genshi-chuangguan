"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const officialQuizScore = require("../src/session-scoring.js");

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
