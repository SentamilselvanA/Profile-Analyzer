/**
 * User Classification Service
 * Classifies users based on their coding profiles and activity patterns
 */

export const generateUserClassification = (profiles, analysis) => {
  const leetcode = profiles.find(p => p.platform === 'leetcode');
  const codeforces = profiles.find(p => p.platform === 'codeforces');
  const github = profiles.find(p => p.platform === 'github');

  const scores = {
    problemSolving: 0,
    competitive: 0,
    development: 0,
    consistency: analysis.consistencyScore || 0
  };

  // Problem Solving Score (LeetCode focused)
  if (leetcode) {
    if (leetcode.totalSolved >= 500) scores.problemSolving += 40;
    else if (leetcode.totalSolved >= 300) scores.problemSolving += 30;
    else if (leetcode.totalSolved >= 150) scores.problemSolving += 20;
    else if (leetcode.totalSolved >= 50) scores.problemSolving += 10;

    if (leetcode.hardSolved >= 50) scores.problemSolving += 20;
    else if (leetcode.hardSolved >= 20) scores.problemSolving += 10;
  }

  // Competitive Score (Codeforces focused)
  if (codeforces) {
    if (codeforces.rating >= 1800) scores.competitive += 40;
    else if (codeforces.rating >= 1500) scores.competitive += 30;
    else if (codeforces.rating >= 1200) scores.competitive += 20;
    else if (codeforces.rating >= 1000) scores.competitive += 10;

    if (codeforces.totalSolved >= 200) scores.competitive += 20;
    else if (codeforces.totalSolved >= 100) scores.competitive += 10;
  }

  // Development Score (GitHub focused)
  if (github) {
    if (github.repos >= 20) scores.development += 40;
    else if (github.repos >= 10) scores.development += 30;
    else if (github.repos >= 5) scores.development += 20;
    else if (github.repos >= 2) scores.development += 10;

    if (github.followers >= 50) scores.development += 20;
    else if (github.followers >= 20) scores.development += 10;
  }

  // Determine primary focus
  const maxScore = Math.max(scores.problemSolving, scores.competitive, scores.development);

  let classification = {
    type: '',
    description: '',
    focus: '',
    nextSteps: []
  };

  if (maxScore === scores.problemSolving && scores.problemSolving > 20) {
    if (scores.consistency >= 70) {
      classification.type = "Problem-Solving Expert";
      classification.description = "Advanced algorithmic problem solver with strong consistency";
      classification.focus = "Algorithm Optimization";
    } else if (scores.consistency >= 50) {
      classification.type = "Consistent Problem Solver";
      classification.description = "Reliable problem-solving practice with good progress";
      classification.focus = "Skill Expansion";
    } else {
      classification.type = "Problem-Solving Learner";
      classification.description = "Building algorithmic problem-solving skills";
      classification.focus = "Foundation Building";
    }
  } else if (maxScore === scores.competitive && scores.competitive > 20) {
    if (scores.consistency >= 70) {
      classification.type = "Competitive Programming Specialist";
      classification.description = "Strong competitive programming background with contest experience";
      classification.focus = "Contest Mastery";
    } else {
      classification.type = "Contest-Focused Developer";
      classification.description = "Active in competitive programming contests";
      classification.focus = "Speed & Accuracy";
    }
  } else if (maxScore === scores.development && scores.development > 20) {
    if (scores.consistency >= 70) {
      classification.type = "Full-Stack Developer";
      classification.description = "Active developer with strong project portfolio";
      classification.focus = "Project Development";
    } else {
      classification.type = "Project Builder";
      classification.description = "Focused on building and maintaining development projects";
      classification.focus = "Portfolio Growth";
    }
  } else {
    // Balanced or early stage
    const connectedPlatforms = profiles.length;
    if (connectedPlatforms >= 3 && scores.consistency >= 60) {
      classification.type = "Balanced Developer";
      classification.description = "Well-rounded coding profile across multiple platforms";
      classification.focus = "Comprehensive Growth";
    } else if (connectedPlatforms >= 2) {
      classification.type = "Multi-Platform Learner";
      classification.description = "Developing skills across different coding platforms";
      classification.focus = "Skill Integration";
    } else if (connectedPlatforms === 1) {
      classification.type = "Platform Specialist";
      classification.description = "Deep focus on one coding platform";
      classification.focus = "Specialization";
    } else {
      classification.type = "Coding Explorer";
      classification.description = "Beginning the coding journey";
      classification.focus = "Getting Started";
    }
  }

  // Generate next steps based on classification
  classification.nextSteps = generateNextSteps(classification, profiles, scores);

  return classification;
};

const generateNextSteps = (classification, profiles, scores) => {
  const steps = [];

  switch (classification.type) {
    case "Problem-Solving Expert":
      steps.push("Explore advanced algorithms and system design");
      steps.push("Mentor junior developers in algorithmic thinking");
      steps.push("Contribute to open-source algorithm libraries");
      break;

    case "Consistent Problem Solver":
      steps.push("Increase hard problem ratio to 20% of practice");
      steps.push("Try competitive programming contests");
      steps.push("Focus on time complexity optimization");
      break;

    case "Problem-Solving Learner":
      steps.push("Complete 300+ problems for solid foundation");
      steps.push("Master one topic per week (Arrays, DP, Graphs, etc.)");
      steps.push("Practice with time constraints");
      break;

    case "Competitive Programming Specialist":
      steps.push("Participate in higher-rated contests");
      steps.push("Focus on complex algorithm problems");
      steps.push("Consider competitive programming coaching");
      break;

    case "Contest-Focused Developer":
      steps.push("Improve contest rating through regular participation");
      steps.push("Work on speed and implementation accuracy");
      steps.push("Study contest-winning solutions");
      break;

    case "Full-Stack Developer":
      steps.push("Contribute to large open-source projects");
      steps.push("Build complex full-stack applications");
      steps.push("Network with other developers");
      break;

    case "Project Builder":
      steps.push("Improve project documentation and presentation");
      steps.push("Learn new technologies and frameworks");
      steps.push("Share projects on developer communities");
      break;

    case "Balanced Developer":
      steps.push("Maintain balance across all coding activities");
      steps.push("Deepen expertise in chosen specialization area");
      steps.push("Consider advanced certifications or courses");
      break;

    case "Multi-Platform Learner":
      steps.push("Connect remaining coding platforms");
      steps.push("Balance time between different coding activities");
      steps.push("Find your primary coding focus area");
      break;

    case "Platform Specialist":
      steps.push("Connect additional coding platforms for balance");
      steps.push("Explore related skills in your focus area");
      steps.push("Build comprehensive knowledge in your specialty");
      break;

    case "Coding Explorer":
      steps.push("Set up profiles on LeetCode, Codeforces, and GitHub");
      steps.push("Start with 3-5 problems per day");
      steps.push("Build your first personal project");
      break;
  }

  return steps;
};