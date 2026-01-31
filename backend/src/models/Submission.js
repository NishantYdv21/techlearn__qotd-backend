const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  userId: String,

  questionNumber: Number,

  submittedAnswer: String,

  result: {
    type: String,
    enum: ["Correct", "Incorrect"]
  },

  timeTaken: Number,

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Submission", SubmissionSchema);
