/**
 * LeetCode Profile Analysis Service
 * Analyzes LeetCode profile data to extract insights
 */

export const analyzeLeetCodeProfile = (profile) => {
  const insights = {
    strengths: [],
    weaknesses: [],
    suggestions: [],
    difficultyInsight: '',
    score: 0
  };

  if (!profile) return insights;

  const { totalSolved, easySolved, mediumSolved, hardSolved } = profile;

  // Difficulty Distribution Analysis
  const total = easySolved + mediumSolved + hardSolved;
  const easyPercent = total > 0 ? (easySolved / total) * 100 : 0;
  const mediumPercent = total > 0 ? (mediumSolved / total) * 100 : 0;
  const hardPercent = total > 0 ? (hardSolved / total) * 100 : 0;

  // Strength Detection
  if (totalSolved >= 500) {
    insights.strengths.push("Excellent problem-solving foundation");
    insights.score += 25;
  } else if (totalSolved >= 300) {
    insights.strengths.push("Strong problem-solving practice discipline");
    insights.score += 20;
  } else if (totalSolved >= 150) {
    insights.strengths.push("Good problem-solving consistency");
    insights.score += 15;
  } else if (totalSolved >= 50) {
    insights.strengths.push("Building problem-solving skills");
    insights.score += 10;
  }

  if (hardSolved >= 50) {
    insights.strengths.push("Excellent exposure to hard algorithmic challenges");
    insights.score += 15;
  } else if (hardSolved >= 30) {
    insights.strengths.push("Good exposure to hard problems");
    insights.score += 10;
  } else if (hardSolved >= 15) {
    insights.strengths.push("Decent hard problem practice");
    insights.score += 5;
  }

  if (mediumSolved >= 200) {
    insights.strengths.push("Strong intermediate problem-solving skills");
    insights.score += 10;
  }

  // Weakness Detection
  if (totalSolved < 50) {
    insights.weaknesses.push("Limited problem-solving experience");
    insights.suggestions.push("Start with 3-5 problems daily to build consistency");
  }

  if (hardSolved < 10 && totalSolved > 100) {
    insights.weaknesses.push("Avoiding challenging problems");
    insights.suggestions.push("Include at least 1 hard problem in your weekly practice");
  }

  if (mediumPercent < 30 && totalSolved > 100) {
    insights.weaknesses.push("Limited intermediate problem exposure");
    insights.suggestions.push("Focus on medium difficulty problems for balanced skill development");
  }

  if (easyPercent > 70 && totalSolved > 50) {
    insights.weaknesses.push("Stuck at basic problem level");
    insights.suggestions.push("Gradually increase medium and hard problem ratio");
  }

  // Difficulty Insight
  if (hardPercent >= 15 && mediumPercent >= 40) {
    insights.difficultyInsight = "Advanced problem-solving skills with good difficulty balance";
  } else if (hardPercent >= 10 && mediumPercent >= 30) {
    insights.difficultyInsight = "Strong intermediate skills with some advanced exposure";
  } else if (mediumPercent >= 40) {
    insights.difficultyInsight = "Solid intermediate foundation, ready for harder challenges";
  } else if (easyPercent > 60) {
    insights.difficultyInsight = "Building basic skills, focus on medium difficulty next";
  } else {
    insights.difficultyInsight = "Developing problem-solving skills across difficulty levels";
  }

  // Activity-based suggestions
  if (totalSolved > 0) {
    if (hardSolved === 0) {
      insights.suggestions.push("Try your first hard problem this week - start with arrays or strings");
    }

    if (mediumSolved < totalSolved * 0.4) {
      insights.suggestions.push("Increase medium problem ratio to 40-50% of your practice");
    }

    insights.suggestions.push("Practice one topic deeply: Arrays, Strings, DP, or Graphs");
    insights.suggestions.push("Solve problems in 45-minute sessions with breaks");
  }

  return insights;
};