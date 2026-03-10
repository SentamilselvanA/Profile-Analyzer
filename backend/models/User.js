import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    leetcodeUsername: {
      type: String,
      default: ""
    },
    codeforcesUsername: {
      type: String,
      default: ""
    },
    githubUsername: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);