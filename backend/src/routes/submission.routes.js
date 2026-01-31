const router = require("express").Router();
const controller = require("../controllers/submission.controller");

router.post("/submit", controller.submitAnswer);

module.exports = router;
