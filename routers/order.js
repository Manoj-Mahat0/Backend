const express = require("express");
const Router = express.Router();
const orderController = require("../controllers/order")

/**
 * @swagger
 * /order/link/:userId/:gymId/:subscriptionId:
 *   get:
 *     summary: ADMIN | OWNER | USER get redirect payment link
 */

Router.get("/link/:userId/:gymId/:subscriptionId", orderController.sendPaymentLink);

Router.get("/info/:merchantTransactionId", orderController.getOrderInfo);

Router.get("/:encData", orderController.addOrder);

Router.get("/status/:merchantTransactionId", orderController.updateOrderStatus);

module.exports = Router;