import axios from "axios";

export const fetchLeetCodeProfile = async (username) => {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }
  `;

  const response = await axios.post(
    "https://leetcode.com/graphql",
    {
      query,
      variables: { username }
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const user = response.data?.data?.matchedUser;

  if (!user) {
    throw new Error("LeetCode user not found");
  }

  const stats = user.submitStats.acSubmissionNum;

  let easy = 0;
  let medium = 0;
  let hard = 0;
  let total = 0;

  stats.forEach((item) => {
    if (item.difficulty === "Easy") easy = item.count;
    if (item.difficulty === "Medium") medium = item.count;
    if (item.difficulty === "Hard") hard = item.count;
    if (item.difficulty === "All") total = item.count;
  });

  return {
    platform: "leetcode",
    username,
    totalSolved: total,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
    rating: 0,
    rank: user.profile?.ranking?.toString() || "",
    streak: 0,
    rawData: user
  };
};