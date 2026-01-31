const mongoose = require("mongoose");

const QOTDStateSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "qotd_state"
  },
  currentQuestionNumber: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("QOTDState", QOTDStateSchema);
