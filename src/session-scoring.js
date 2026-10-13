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
const SKILL_LABELS = {
  "1-square-root":"正数开平方", "1-decimal-fraction":"小数与分数开平方", "1-arithmetic-root":"算术平方根与平方",
  "2-radicand":"被开方数非负条件", "2-denominator":"分母不为零", "2-combined":"多个条件同时满足",
  "3-absolute-value":"平方根与绝对值", "3-sign":"根据正负号去绝对值", "3-expression":"含字母根式化简",
  "4-factor":"提取平方因数", "4-fraction":"分数与小数根式化简", "4-rationalize":"分母有理化",
  "5-simplest":"判断最简二次根式", "6-like-radicals":"识别同类二次根式",
  "7-add-subtract":"合并同类二次根式", "8-multiply-divide":"根式乘除", "8-equation":"根式相关方程", "8-rationalize":"分母有理化"
};
function classifyQuestion(q) {
  // Explicit author-assigned tags always win over text heuristics.
  if (q && typeof q.skillId === "string" && q.skillId && q.skillId !== "unknown") {
    return { id: q.skillId, label: q.skillLabel || SKILL_LABELS[q.skillId] || "自定义技能" };
  }
  const level = Number(q && q.kp) || 0;
  const source = [q && q.stem, q && q.hint, ...((q && q.steps) || [])].join(" ").replace(/<[^>]*>/g, " ");
  let key = "";
  if (level === 1) key = /算术平方根/.test(source) ? "arithmetic-root" : /小数|分数|\.\d/.test(source) ? "decimal-fraction" : "square-root";
  else if (level === 2) key = /同时|两个根号|两个条件|分母|分式/.test(source) ? (/分母|分母不能为 0/.test(source) ? "denominator" : "combined") : "radicand";
  else if (level === 3) key = /a³b|ab³|移进根号|含字母|化简/.test(source) ? "expression" : /正负|x &lt;|x &gt;|a &lt;|b &lt;/.test(source) ? "sign" : "absolute-value";
  else if (level === 4) key = /分母|有理化/.test(source) ? "rationalize" : /小数|分数/.test(source) ? "fraction" : "factor";
  else if (level === 5) key = "simplest";
  else if (level === 6) key = "like-radicals";
  else if (level === 7) key = "add-subtract";
  else if (level === 8) key = /方程|解方程/.test(source) ? "equation" : /分母|有理化/.test(source) ? "rationalize" : "multiply-divide";
  else return { id: "unknown", label: "待识别技能" };
  const id = level + "-" + key;
  return { id, label: SKILL_LABELS[id] || "基础技能" };
}
const SKILL_PREREQUISITES = {
  "2-radicand": ["1-square-root"],
  "2-combined": ["1-square-root", "2-radicand"],
  "3-absolute-value": ["1-arithmetic-root"],
  "3-sign": ["1-arithmetic-root", "2-radicand"],
  "3-expression": ["1-arithmetic-root", "2-radicand"],
  "4-factor": ["1-square-root"],
  "4-fraction": ["1-decimal-fraction"],
  "4-rationalize": ["1-square-root", "2-denominator"],
  "5-simplest": ["1-square-root", "4-factor"],
  "6-like-radicals": ["4-factor", "5-simplest"],
  "7-add-subtract": ["5-simplest", "6-like-radicals"],
  "8-multiply-divide": ["4-factor", "6-like-radicals"],
  "8-equation": ["2-radicand", "7-add-subtract"],
  "8-rationalize": ["4-rationalize", "6-like-radicals"]
};
function getSkillPlan(skillId) {
  const current = { id: skillId, label: SKILL_LABELS[skillId] || "基础技能" };
  const prerequisites = (SKILL_PREREQUISITES[skillId] || []).map(id => {
    const level = Number(id.split("-")[0]);
    return { id, level, label: SKILL_LABELS[id] || "基础技能" };
  });
  return { current, prerequisites, firstLevel: prerequisites.length ? prerequisites[0].level : Number(String(skillId).split("-")[0]) || 1 };
}
function recommendSubskill(attempts) {
  const list = Array.isArray(attempts) ? attempts : [];
  const groups = new Map();
  for (const a of list) {
    if (!a || !a.skillId || a.variant || a.firstCorrect === undefined) continue;
    if (!groups.has(a.skillId)) groups.set(a.skillId, { id: a.skillId, label: a.skillLabel || SKILL_LABELS[a.skillId] || "基础技能", total: 0, correct: 0, latest: 0 });
    const g = groups.get(a.skillId); g.total++; if (a.firstCorrect) g.correct++; g.latest = Math.max(g.latest, Number(a.timestamp) || 0);
  }
  const ranked = [...groups.values()].filter(g => g.total >= 3).map(g => ({ ...g, percent: Math.round(g.correct / g.total * 100) }))
    .filter(g => g.percent < 70).sort((a,b) => a.percent-b.percent || b.total-a.total || b.latest-a.latest);
  return ranked[0] || null;
}
function skillSnapshot(history) {
  const values = Array.isArray(history) ? history.filter(v => v === 0 || v === 1) : [];
  const count = values.length;
  const percent = count ? Math.round(values.reduce((sum, value) => sum + value, 0) / count * 100) : 0;
  const status = !count ? "未练习" : count < 3 ? "样本较少" : percent < 60 ? "优先巩固" : percent < 80 ? "继续练习" : "暂时掌握较好";
  return { count, percent, status };
}
if (typeof module !== "undefined" && module.exports) module.exports = Object.assign(officialQuizScore, { shouldAddVariant, skillSnapshot, recommendSkill, classifyQuestion, recommendSubskill, getSkillPlan });
