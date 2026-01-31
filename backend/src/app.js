const express = require("express");
const app = express();

app.use(express.json());

app.use("/api", require("./routes/qotd.routes"));
app.use("/api", require("./routes/submission.routes"));

app.get("/", (req, res) => {
  res.send("QOTD Backend Running");
});

module.exports = app;
