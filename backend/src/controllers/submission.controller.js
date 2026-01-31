const Question = require("../models/Question");
const QOTDState = require("../models/QOTDState");
const Submission = require("../models/Submission");

exports.submitAnswer = async (req, res) => {
  const { userId, answer, timeTaken } = req.body;

  if (!userId || !answer) {
    return res.status(400).json({ message: "userId and answer required" });
  }

  const state = await QOTDState.findById("qotd_state");
  const question = await Question.findOne({
    questionNumber: state.currentQuestionNumber
  });

  const result =
    answer.trim() === question.expectedOutput.trim()
      ? "Correct"
      : "Incorrect";

  await Submission.create({
    userId,
    questionNumber: question.questionNumber,
    submittedAnswer: answer,
    result,
    timeTaken
  });

  res.json({ result });
};
