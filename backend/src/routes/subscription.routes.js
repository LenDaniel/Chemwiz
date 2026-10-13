const express = require("express");

const { placeholder } = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/", placeholder);

module.exports = router;
