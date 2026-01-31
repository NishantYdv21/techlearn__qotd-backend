const router = require("express").Router();
const controller = require("../controllers/qotd.controller");

router.get("/qotd", controller.getQOTD);

module.exports = router;
