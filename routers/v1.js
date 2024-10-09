const express = require("express");
const { or } = require("sequelize");
const Router = express.Router();
const orderController = require("../controllers/order");
const { addFeedback } = require("../controllers/feedback");
const { where, Op } = require("sequelize");
const { qrcodeUpload } = require("../helper/mutler");
const { addBank } = require("../controllers/bank");
let db = require("../models");
let Modal = db.feedback;

Router.get("/test", (req, res) => {
  return res.status(200).json("You are in! ");
});

Router.use("/login", require("../controllers/login"));

Router.use("/user", require("../controllers/user"));

Router.use("/gym", require("./gym"));

Router.use("/subscription", require("./subscription"));

Router.use("/order", require("./order"));

Router.use("/punch", require("./punch"));

Router.use("/attendance", require("./attendence"));

Router.get("/purchase", orderController.getAllOrders);

Router.post("/feedback", addFeedback);
Router.post("/bank", qrcodeUpload.single("image"), addBank);

module.exports = Router;
