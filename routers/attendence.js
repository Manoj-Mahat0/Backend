const express = require("express");
const Router = express.Router();
const attendenceController = require("../controllers/attendence");
const mult = require("../helper/mutler");

Router.get("/last", attendenceController.getLastAttendence);

Router.get("/", attendenceController.getLastMonthPresentAndAbsentCount)

module.exports = Router;
