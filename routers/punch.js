const express = require("express");
const Router = express.Router();
const punchController = require("../controllers/punch");
const mult = require("../helper/mutler");

Router.post("/in", mult.upload.single('image'), punchController.punchIn);

module.exports = Router;
