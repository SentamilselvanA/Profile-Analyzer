import axios from "axios";

export const fetchGitHubProfile = async (username) => {
  const response = await axios.get(`https://api.github.com/users/${username}`);
  const user = response.data;

  return {
    platform: "github",
    username,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    rating: 0,
    rank: "",
    streak: 0,
    repos: user.public_repos || 0,
    followers: user.followers || 0,
    contributions: 0,
    rawData: user
  };
};