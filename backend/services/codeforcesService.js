import axios from "axios";

export const fetchCodeforcesProfile = async (handle) => {
  const infoRes = await axios.get(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );

  const statusRes = await axios.get(
    `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`
  );

  if (infoRes.data.status !== "OK") {
    throw new Error("Codeforces user not found");
  }

  const user = infoRes.data.result[0];
  const submissions = statusRes.data.result || [];

  const solvedSet = new Set();
  const tagsMap = {};

  submissions.forEach((sub) => {
    if (sub.verdict === "OK" && sub.problem?.contestId && sub.problem?.index) {
      const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!solvedSet.has(problemId)) {
          solvedSet.add(problemId);
          (sub.problem.tags || []).forEach(tag => {
              tagsMap[tag] = (tagsMap[tag] || 0) + 1;
          });
      }
    }
  });

  return {
    platform: "codeforces",
    username: handle,
    totalSolved: solvedSet.size,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    rating: user.rating || 0,
    rank: user.rank || "",
    streak: 0,
    tags: tagsMap,
    rawData: user
  };
};