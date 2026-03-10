/**
 * Codeforces Profile Analysis Service
 * Analyzes Codeforces contest performance and problem-solving activity
 */

export const analyzeCodeforcesProfile = (profile) => {
  const insights = {
    strengths: [],
    weaknesses: [],
    suggestions: [],
    contestInsight: '',
    score: 0
  };

  if (!profile) return insights;

  const { rating, totalSolved, rank, maxRating } = profile;

  // Rating-based Analysis
  if (rating >= 1800) {
    insights.strengths.push("Expert-level competitive programming skills");
    insights.score += 25;
  } else if (rating >= 1500) {
    insights.strengths.push("Strong competitive programming foundation");
    insights.score += 20;
  } else if (rating >= 1200) {
    insights.strengths.push("Good competitive programming progress");
    insights.score += 15;
  } else if (rating >= 1000) {
    insights.strengths.push("Developing competitive programming skills");
    insights.score += 10;
  } else if (rating >= 800) {
    insights.strengths.push("Building competitive programming basics");
    insights.score += 5;
  }

  // Problem-solving activity
  if (totalSolved >= 300) {
    insights.strengths.push("Extensive competitive problem-solving experience");
    insights.score += 15;
  } else if (totalSolved >= 200) {
    insights.strengths.push("Good competitive problem-solving practice");
    insights.score += 10;
  } else if (totalSolved >= 100) {
    insights.strengths.push("Decent competitive problem exposure");
    insights.score += 5;
  }

  // Rating progress
  if (maxRating && rating && maxRating - rating <= 100) {
    insights.strengths.push("Consistent rating performance");
    insights.score += 5;
  }

  // Weakness Detection
  if (!rating || rating < 800) {
    insights.weaknesses.push("Limited competitive programming experience");
    insights.suggestions.push("Start with Div. 4 contests to build familiarity");
  }

  if (totalSolved < 50) {
    insights.weaknesses.push("Low competitive problem-solving activity");
    insights.suggestions.push("Solve more Codeforces problems alongside contests");
  }

  if (rating && rating < 1200 && totalSolved > 100) {
    insights.weaknesses.push("Rating not reflecting problem-solving volume");
    insights.suggestions.push("Focus on speed and implementation accuracy in contests");
  }

  // Contest Insight
  if (rating >= 1800) {
    insights.contestInsight = "Expert competitive programmer with strong contest performance";
  } else if (rating >= 1500) {
    insights.contestInsight = "Specialist level with good contest consistency";
  } else if (rating >= 1200) {
    insights.contestInsight = "Pupil level with developing contest skills";
  } else if (rating >= 1000) {
    insights.contestInsight = "Newbie level, building contest foundation";
  } else {
    insights.contestInsight = "Beginner competitive programmer";
  }

  // Activity-based suggestions
  if (rating < 1200) {
    insights.suggestions.push("Participate in Div. 3 contests regularly (2-3 per month)");
    insights.suggestions.push("Focus on implementation speed and basic algorithms");
  }

  if (rating >= 1200 && rating < 1500) {
    insights.suggestions.push("Try Div. 2 contests and work on advanced topics");
    insights.suggestions.push("Practice binary search, greedy, and graph algorithms");
  }

  if (rating >= 1500) {
    insights.suggestions.push("Participate in Div. 1 contests for higher competition");
    insights.suggestions.push("Focus on complex algorithms and optimization techniques");
  }

  insights.suggestions.push("Solve contest problems in virtual contests to practice");
  insights.suggestions.push("Review unsuccessful contest submissions for learning");

  return insights;
};