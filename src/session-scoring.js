"use strict";
/**
 * Score only official questions from their first attempt.
 * Supplemental variant exercises and retry attempts never change the official score.
 */
function officialQuizScore(qs) {
  const official = qs.filter(item => !item.isVariant);
  return {
    tot: official.length,
    c: official.filter(item => item.firstRes === 1).length
  };
}

/**
 * Offer a follow-up variant after a successful retry, hint-assisted success,
 * or unusually slow success relative to the learner's own recent baseline.
 * Speed is never a penalty; it only helps decide whether extra practice may help.
 */
function shouldAddVariant(item, attempts) {
  if (!item || item.isVariant) return false;
  if (item.retryStage === 1 && item.res === 1) return true;
  if (item.firstRes !== 1) return false;
  if (item.hintUsed) return true;
  if (!(item.firstTimeMs > 0)) return false;
  const history = (attempts || []).filter(a =>
    a !== item.attemptLog &&
    !a.variant &&
    a.kp === item.q.kp &&
    a.questionType === item.q.type &&
    a.firstCorrect &&
    !a.hintUsed &&
    a.firstTimeMs > 0
  ).slice(-20).map(a => a.firstTimeMs).sort((a,b) => a-b);
  if (history.length < 5) return false;
  const mid = Math.floor(history.length / 2);
  const median = history.length % 2 ? history[mid] : (history[mid-1] + history[mid]) / 2;
  return median > 0 && item.firstTimeMs > median * 1.5;
}
/**
 * Recommend the earliest skill that needs evidence or reinforcement.
 * This intentionally follows prerequisite order instead of chasing the lowest percentage.
 */
function recommendSkill(histories) {
  const skills = Array.isArray(histories) ? histories : [];
  for (let i = 0; i < 8; i++) {
    const snapshot = skillSnapshot(skills[i] || []);
    if (snapshot.count < 3) return { level: i + 1, reason: "先补足基础练习样本", ...snapshot };
    if (snapshot.percent < 60) return { level: i + 1, reason: "近期正确率偏低，建议优先巩固", ...snapshot };
  }
  for (let i = 0; i < 8; i++) {
    const snapshot = skillSnapshot(skills[i] || []);
    if (snapshot.percent < 80) return { level: i + 1, reason: "再练几题，确认是否稳定掌握", ...snapshot };
  }
  return { level: null, reason: "目前各知识点表现稳定，可尝试综合挑战", count: 0, percent: 100, status: "继续挑战" };
}
function skillSnapshot(history) {
  const values = Array.isArray(history) ? history.filter(v => v === 0 || v === 1) : [];
  const count = values.length;
  const percent = count ? Math.round(values.reduce((sum, value) => sum + value, 0) / count * 100) : 0;
  const status = !count ? "未练习" : count < 3 ? "样本较少" : percent < 60 ? "优先巩固" : percent < 80 ? "继续练习" : "暂时掌握较好";
  return { count, percent, status };
}
if (typeof module !== "undefined" && module.exports) module.exports = Object.assign(officialQuizScore, { shouldAddVariant, skillSnapshot, recommendSkill });
