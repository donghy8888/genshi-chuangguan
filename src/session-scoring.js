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
if (typeof module !== "undefined" && module.exports) module.exports = officialQuizScore;
