var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to Express");
});

router.get("/health", function (req, res, next) {
  res.send("Node instance Running Successfully");
});

module.exports = router;
