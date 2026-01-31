require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("../models/Question");
const QOTDState = require("../models/QOTDState");

const questions = [
  {
    questionNumber: 1,
    title: "Reverse a String",
    difficulty: "Easy",
    problemStatement: "Given a string s, return the string reversed.",
    examples: [
      {
        input: "s = \"hello\"",
        output: "\"olleh\"",
        explanation: "Reverse the string."
      }
    ],
    constraints: ["1 ≤ s.length ≤ 10^5"],
    expectedOutput: "olleh",
    hints: ["Use reverse traversal"]
  },
  {
    questionNumber: 2,
    title: "Valid Palindrome",
    difficulty: "Easy",
    problemStatement:
      "Given a string, determine if it is a palindrome.",
    examples: [
      {
        input: "\"A man, a plan, a canal: Panama\"",
        output: "true"
      }
    ],
    constraints: ["1 ≤ s.length ≤ 2*10^5"],
    expectedOutput: "true",
    hints: ["Use two pointers"]
  },
  {
    questionNumber: 3,
    title: "Two Sum",
    difficulty: "Easy",
    problemStatement:
      "Return indices of two numbers that add up to target.",
    examples: [
      {
        input: "[2,7,11,15], target = 9",
        output: "[0,1]"
      }
    ],
    constraints: ["2 ≤ nums.length ≤ 10^4"],
    expectedOutput: "[0,1]",
    hints: ["Use hashmap"]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Question.deleteMany({});
    await QOTDState.deleteMany({});

    await Question.insertMany(questions);

    await QOTDState.create({
      _id: "qotd_state",
      currentQuestionNumber: 1
    });

    console.log("✅ Questions & QOTD state seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
