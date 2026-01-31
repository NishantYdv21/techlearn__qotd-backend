const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    unique: true,
    required: true
  },

  title: String,

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"]
  },

  problemStatement: String,

  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],

  constraints: [String],

  expectedOutput: String,

  hints: [String]
});

module.exports = mongoose.model("Question", QuestionSchema);
