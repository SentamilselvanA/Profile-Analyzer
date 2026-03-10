/**
 * GitHub Profile Analysis Service
 * Analyzes GitHub development activity and project portfolio
 */

export const analyzeGitHubProfile = (profile) => {
  const insights = {
    strengths: [],
    weaknesses: [],
    suggestions: [],
    githubInsight: '',
    score: 0
  };

  if (!profile) return insights;

  const { repos, followers, stars, forks, languages } = profile;

  // Repository Analysis
  if (repos >= 20) {
    insights.strengths.push("Extensive project portfolio and development experience");
    insights.score += 20;
  } else if (repos >= 10) {
    insights.strengths.push("Good project presence and development activity");
    insights.score += 15;
  } else if (repos >= 5) {
    insights.strengths.push("Decent project portfolio");
    insights.score += 10;
  } else if (repos >= 2) {
    insights.strengths.push("Building development portfolio");
    insights.score += 5;
  }

  // Visibility and Impact
  if (followers >= 50) {
    insights.strengths.push("Strong GitHub presence and community visibility");
    insights.score += 15;
  } else if (followers >= 20) {
    insights.strengths.push("Good GitHub visibility");
    insights.score += 10;
  } else if (followers >= 5) {
    insights.strengths.push("Developing GitHub presence");
    insights.score += 5;
  }

  if (stars >= 100) {
    insights.strengths.push("Projects receiving significant community interest");
    insights.score += 10;
  } else if (stars >= 50) {
    insights.strengths.push("Projects gaining community attention");
    insights.score += 5;
  }

  // Language Diversity
  if (languages && languages.length >= 3) {
    insights.strengths.push("Diverse technology stack and language proficiency");
    insights.score += 5;
  }

  // Weakness Detection
  if (repos < 3) {
    insights.weaknesses.push("Limited project portfolio");
    insights.suggestions.push("Start building personal projects to showcase skills");
  }

  if (followers < 5 && repos > 3) {
    insights.weaknesses.push("Low project visibility despite good portfolio");
    insights.suggestions.push("Improve project documentation and descriptions");
  }

  if (!languages || languages.length < 2) {
    insights.weaknesses.push("Limited technology stack exposure");
    insights.suggestions.push("Explore new programming languages and frameworks");
  }

  if (stars < 10 && repos > 5) {
    insights.weaknesses.push("Projects not gaining community interest");
    insights.suggestions.push("Focus on project quality and unique value propositions");
  }

  // GitHub Insight
  if (repos >= 15 && followers >= 30) {
    insights.githubInsight = "Active developer with strong project portfolio and community presence";
  } else if (repos >= 10 && followers >= 15) {
    insights.githubInsight = "Solid developer portfolio with growing community visibility";
  } else if (repos >= 5) {
    insights.githubInsight = "Developing project portfolio with potential for growth";
  } else if (repos >= 2) {
    insights.githubInsight = "Building development presence and project experience";
  } else {
    insights.githubInsight = "Early-stage developer portfolio";
  }

  // Activity-based suggestions
  if (repos < 5) {
    insights.suggestions.push("Complete 2-3 personal projects in the next 2 months");
    insights.suggestions.push("Start with simple web apps, CLI tools, or data analysis projects");
  }

  if (repos >= 3) {
    insights.suggestions.push("Add comprehensive README files to all projects");
    insights.suggestions.push("Pin your 3 best projects on your profile");
    insights.suggestions.push("Write clear project descriptions and setup instructions");
  }

  if (followers < 10 && repos >= 3) {
    insights.suggestions.push("Share projects on LinkedIn, Twitter, or dev communities");
    insights.suggestions.push("Contribute to open source projects to increase visibility");
  }

  insights.suggestions.push("Maintain consistent commit activity (at least 3-4 days per week)");
  insights.suggestions.push("Document your learning journey in project repositories");

  return insights;
};