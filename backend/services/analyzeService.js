export const generateAnalysis = (profiles) => {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];
  let consistencyScore = 50;

  const leetcode = profiles.find((p) => p.platform === "leetcode");
  const codeforces = profiles.find((p) => p.platform === "codeforces");
  const github = profiles.find((p) => p.platform === "github");

  if (leetcode) {
    if (leetcode.totalSolved >= 300) {
      strengths.push("Strong problem solving practice on LeetCode");
      consistencyScore += 15;
    } else {
      weaknesses.push("Low LeetCode problem count");
      suggestions.push("Solve at least 3 LeetCode problems per day");
    }

    if (leetcode.hardSolved >= 30) {
      strengths.push("Good exposure to hard problems");
      consistencyScore += 10;
    } else {
      weaknesses.push("Needs more hard problem practice");
      suggestions.push("Add 2 hard problems per week");
    }

    if (leetcode.mediumSolved < 100) {
      weaknesses.push("Medium problem practice is limited");
      suggestions.push("Focus on arrays, DP, graphs, and trees");
    }
  }

  if (codeforces) {
    if (codeforces.rating >= 1200) {
      strengths.push("Decent Codeforces contest performance");
      consistencyScore += 10;
    } else {
      weaknesses.push("Contest rating can be improved");
      suggestions.push("Participate in weekly Codeforces contests");
    }

    if (codeforces.totalSolved < 150) {
      weaknesses.push("Codeforces solved count is low");
      suggestions.push("Practice more implementation and greedy problems");
    }
  }

  if (github) {
    if (github.repos >= 5) {
      strengths.push("Good project presence on GitHub");
      consistencyScore += 10;
    } else {
      weaknesses.push("GitHub project portfolio is limited");
      suggestions.push("Push more projects and maintain README files");
    }

    if (github.followers >= 10) {
      strengths.push("Some visibility on GitHub");
    }
  }

  consistencyScore = Math.max(0, Math.min(100, consistencyScore));

  if (strengths.length === 0) strengths.push("You have started building your coding profile");
  if (weaknesses.length === 0) weaknesses.push("No major weakness detected in basic analysis");
  if (suggestions.length === 0) suggestions.push("Maintain your current practice and keep improving");

  return {
    strengths,
    weaknesses,
    suggestions,
    consistencyScore
  };
};