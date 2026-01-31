const evaluateSubmission = (userAnswer, expectedOutput) => {
  if (!userAnswer) return "Incorrect";

  if (userAnswer.trim() === expectedOutput.trim()) {
    return "Correct";
  }

  return "Incorrect";
};

module.exports = evaluateSubmission;
