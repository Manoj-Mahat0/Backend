const express = require("express");
const path = require("path");

const Router = express.Router();

Router.use("/api", require("./api"));

Router.get("/maintainance", (req, res) => {
    res.sendFile(path.join(__dirname, "../static", "paymentMaintainance.html"));
});

Router.get("/payment-success/:merchantTransactionId", (req, res) => {
    let merchantTransactionId = req.params.merchantTransactionId;
    res.sendFile(path.join(__dirname, "../static", "paymentSuccess.html"));
});

Router.get("/payment-failed", (req, res) => {
    res.sendFile(path.join(__dirname, "../static", "paymentFailed.html"));
});

module.exports = Router;
