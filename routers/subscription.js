const express = require("express");
const Router = express.Router();
const subscriptionController = require("../controllers/subscription")
const mult = require("../helper/mutler");

/**
 * @swagger
 * /subscription:
 *   post:
 *     summary: ADMIN | OWNER create new subscription plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: subscription name
 *                 example: 'Prime'
 *               tag:
 *                 type: string
 *                 description: tag for plan
 *                 example: 'Prime'
 *               price:
 *                 type: decimal
 *                 description: price of plan
 *                 example: 500.00
 *               validity:
 *                 type: integer
 *                 description: validity of plan
 *                 example: 1
 *               validityMeasure:
 *                 type: string
 *                 description: measure of validity
 *                 example: 'D' 
 *                 possibel values: ['D', 'M', 'Y']
 *               gymId:
 *                 type: integer
 *                 description: gym id
 *                 example: 1
 *               gymOwnerId:
 *                 type: integer
 *                 description: gym owner id
 *                 example: 1
 */
Router.post("/", subscriptionController.addSubscription);

/**
 * @swagger
 * /subscription/:gymId:
 *  get:
 *   summary: get subscription plan by gym id
 *  parameters:
 *   - in: path
 *     name: gymId
 *     required: true
 *  schema:
 *     type: integer
 *     description: gym id
 *     example: 1
 */
Router.get("/:gymId", subscriptionController.getSubscriptionByGymId);

/**
 * @swagger
 * /subscription:
 *  get:
 *   summary: ADMIN | OWNER | USER get active subscription plan for user
 */
Router.get("/", subscriptionController.getUserActiveSubscription);

module.exports = Router;