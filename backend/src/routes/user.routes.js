const express = require("express");

const { placeholder } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", placeholder);

module.exports = router;
