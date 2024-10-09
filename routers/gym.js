const express = require("express");
const Router = express.Router();
const gymController = require("../controllers/gym");
const mult = require("../helper/mutler");

/**
 * @swagger
 * /gym:
 *   post:
 *     summary: ADMIN | OWNER create new gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buildingName:
 *                 type: string
 *                 description: name of the building
 *                 example: 'Flat 16, Godavari Vihar society'
 *               line1:
 *                 type: string
 *                 description: line1
 *                 example: 'Ramwadi'
 *               line2:
 *                 type: string
 *                 description: line2
 *                 example: 'Panchvati'
 *               landmark:
 *                 type: string
 *                 description:  landmark
 *                 example: 'near juna salunke class'
 *               pincode:
 *                 type: string
 *                 description:  pincode
 *                 example: '422303'
 *               mobile1:
 *                 type: string
 *                 description:  mobile1
 *                 example: '7020926583'
 *               mobile2:
 *                 type: string
 *                 description:  mobile2
 *                 example: '9420456583'
 *               googleMap:
 *                 type: string
 *                 description:  google map link
 *                 example: 'https://www.google.com/maps/place/18.5204,73.8567'
 *               name:
 *                 type: string
 *                 description: name of gym
 *                 example: 'Gym Name'
 *               description:
 *                 type: string
 *                 description: last name
 *                 example: 'Best gym in the city'
 *               gymOwnerId:
 *                 type: string
 *                 description: gym owner id
 *                 example: '1'
 *               chargesPerEntry:
 *                 type: number
 *                 description: cost of gym per entry
 *                 example: 10.5
 */
Router.post("/", mult.upload.single("image"), gymController.addGym);

/**
 * @swagger
 * /gym/info/:id:
 *   get:
 *     summary: OPEN get gym details
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of gym
 *         required: true
 *         schema:
 *           type: path
 *           example: '1'
 */
Router.get("/info/:id", gymController.gymInfo);

Router.get("/profile/:id", gymController.gymOwnerProfile);

module.exports = Router;
