const Question = require("../models/Question");
const QOTDState = require("../models/QOTDState");

exports.getQOTD = async (req, res) => {
  const state = await QOTDState.findById("qotd_state");

  if (!state) {
    return res.status(500).json({ message: "QOTD state missing" });
  }

  const question = await Question.findOne({
    questionNumber: state.currentQuestionNumber
  });

  if (!question) {
    return res.status(404).json({ message: "QOTD not found" });
  }

  res.json({
    questionNumber: question.questionNumber,
    title: question.title,
    difficulty: question.difficulty,
    problemStatement: question.problemStatement,
    examples: question.examples,
    constraints: question.constraints
  });
};
