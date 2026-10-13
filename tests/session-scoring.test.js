"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const officialQuizScore = require("../src/session-scoring.js");
const shouldAddVariant = officialQuizScore.shouldAddVariant;
const skillSnapshot = officialQuizScore.skillSnapshot;
const recommendSkill = officialQuizScore.recommendSkill;
const classifyQuestion = officialQuizScore.classifyQuestion;
const recommendSubskill = officialQuizScore.recommendSubskill;
const getSkillPlan = officialQuizScore.getSkillPlan;

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

test("skill diagnostics ignore malformed history entries", () => {
  assert.deepEqual(skillSnapshot([1, 0, null, "1", 7]), { count: 2, percent: 50, status: "样本较少" });
});

test("diagnostic recommends the earliest under-practiced prerequisite first", () => {
  const histories = Array.from({ length: 8 }, () => [1, 1, 1, 1]);
  histories[0] = [1, 0];
  histories[5] = [0, 0, 0, 0];
  assert.deepEqual(recommendSkill(histories), {
    level: 1, reason: "先补足基础练习样本", count: 2, percent: 50, status: "样本较少"
  });
});

test("diagnostic prioritizes a demonstrated weak skill after sample size is sufficient", () => {
  const histories = Array.from({ length: 8 }, () => [1, 1, 1, 1]);
  histories[2] = [1, 0, 0, 0];
  assert.equal(recommendSkill(histories).level, 3);
  assert.equal(recommendSkill(histories).percent, 25);
});

test("diagnostic recommends a mixed challenge when all skills are stable", () => {
  const histories = Array.from({ length: 8 }, () => [1, 1, 1, 1]);
  assert.equal(recommendSkill(histories).level, null);
});

test("question classifier assigns level-specific skill tags", () => {
  assert.equal(classifyQuestion({ kp: 2, stem: "要使根式有意义", hint: "被开方数要 ≥ 0" }).id, "2-radicand");
  assert.equal(classifyQuestion({ kp: 2, stem: "要使分式有意义", hint: "分母不能为 0" }).id, "2-denominator");
  assert.equal(classifyQuestion({ kp: 7, stem: "计算根式加减" }).id, "7-add-subtract");
});

test("subskill diagnostic only recommends weaknesses with at least three attempts", () => {
  const attempts = [
    { skillId: "2-radicand", skillLabel: "被开方数非负条件", firstCorrect: false },
    { skillId: "2-radicand", skillLabel: "被开方数非负条件", firstCorrect: false }
  ];
  assert.equal(recommendSubskill(attempts), null);
  attempts.push({ skillId: "2-radicand", skillLabel: "被开方数非负条件", firstCorrect: true });
  assert.equal(recommendSubskill(attempts).percent, 33);
  assert.equal(recommendSubskill(attempts).label, "被开方数非负条件");
});

test("subskill diagnostic ignores supplemental variant attempts", () => {
  const attempts = [
    { skillId: "4-factor", firstCorrect: false },
    { skillId: "4-factor", firstCorrect: false },
    { skillId: "4-factor", firstCorrect: true },
    { skillId: "4-factor", firstCorrect: true, variant: true }
  ];
  assert.equal(recommendSubskill(attempts).total, 3);
});

test("explicit author skill tags override heuristic classification", () => {
  assert.deepEqual(classifyQuestion({ kp: 7, stem: "根式加减", skillId: "2-radicand", skillLabel: "自定义被开方数条件" }), {
    id: "2-radicand", label: "自定义被开方数条件"
  });
});

test("skill plans expose prerequisite skills in a stable learning order", () => {
  const plan = getSkillPlan("7-add-subtract");
  assert.equal(plan.current.label, "合并同类二次根式");
  assert.deepEqual(plan.prerequisites.map(p => p.id), ["5-simplest", "6-like-radicals"]);
  assert.equal(plan.firstLevel, 5);
});

test("a foundational skill without declared prerequisites starts at its own level", () => {
  assert.equal(getSkillPlan("1-square-root").firstLevel, 1);
  assert.deepEqual(getSkillPlan("1-square-root").prerequisites, []);
});
