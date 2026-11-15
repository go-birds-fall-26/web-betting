const router = require("express").Router();
const testEspnRouter = require("./testEspn");

router.use("/", require("./home"));
router.use("/bets", require("./bets"));
router.use("/account", require("./account"));
router.use("/", require("./auth"));
router.use("/markets", require("./markets"));

if (process.env.NODE_ENV !== "prod") {
  router.use("/test/espn", testEspnRouter);
}

module.exports = router;
