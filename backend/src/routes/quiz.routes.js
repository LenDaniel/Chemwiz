const express = require("express");

const { placeholder } = require("../controllers/quiz.controller");

const router = express.Router();

router.get("/", placeholder);

module.exports = router;
