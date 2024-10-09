const express = require("express");
const userDao = require("../dao/user");
const mediaDao = require("../dao/media");
const addressDao = require("../dao/address");
const constants = require("../config/constant");
const Router = express.Router();
const mult = require("../helper/mutler");
const loginFunction = require("../helper/loginFunctions");

/**
 * @swagger
 * /user:
 *   get:
 *     summary: ADMIN | OWNER | USER get user profile information
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer YOUR_TOKEN_HERE'
 *     responses:
 *       200:
 *         description: return user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: '1'
 *                 firstName:
 *                   type: string
 *                   example: 'Sushmit'
 *                 lastName:
 *                   type: string
 *                   example: 'Katkale'
 *                 email:
 *                   type: string
 *                   example: 'katkalesushmit1189@gmail.com'
 *                 mobile:
 *                   type: string
 *                   example: '7020926583'
 */
Router.get("/", async (req, res) => {
  try {
    let user = await userDao.findById(req.loggedInUser.id);
    if (user) {
      return res.status(200).json(await userDao.mapUserData(user));
    } else {
      return res.status(400).json(constants.error_messages[400]);
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

/**
 * @swagger
 * /user/profile-image:
 *   post:
 *     summary: ADMIN | OWNER | USER change profile image
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer YOUR_TOKEN_HERE'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: file
 *                 description: "put the updated image here"
 *     responses:
 *       200:
 *         description: return integer 0 - false, 1- true
 *         content:
 *           integer:
 *               example: 1
 */
Router.post("/profile-image", mult.upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("Media not found");
    }
    console.log("yash vatshkjk");

    let previousProfileId = req.loggedInUser.fk_profile_image_id;

    let user = await userDao.patch(req.loggedInUser.id, {
      fk_profile_image_id: req.file.media.id,
    });

    if (user) {
      if (user && user.length == 1 ? user[0] : false) {
        await mult.deletePreviousFile(previousProfileId);
      }
      return res.status(200).json(user && user.length == 1 ? user[0] : user);
    } else {
      return res.status(400).json(constants.error_messages[400]);
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: ADMIN | OWNER | USER change address
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
 *               image:
 *                 type: file
 *                 description: profile image
 *     responses:
 *       200:
 *         description: return integer 0 - false, 1- true
 *         content:
 *           integer:
 *               example: 1
 */
Router.post("/address", async (req, res) => {
  try {
    let body = req.body;
    let addressBody = {
      building_name: body.buildingName,
      line_1: body.line1,
      line_2: body.line2,
      landmark: body.landmark,
      pincode: body.pincode,
      mobile_1: body.mobile1,
      mobile_2: body.mobile2,
      google_map: body.googleMap,
      is_active: "1",
    };

    let data = await addressDao.insert(addressBody);

    if (data) {
      let user = await userDao.patch(req.loggedInUser.id, {
        fk_address_id: data.id,
      });

      if (user && user.length == 1 ? user[0] : false) {
        let DATA = await addressDao.remove(req.loggedInUser.fk_address_id);
      }
      return res
        .status(200)
        .json(await userDao.mapUserDataById(req.loggedInUser.id));
    } else {
      return res.status(400).json(constants.error_messages[400]);
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

/**
 * @swagger
 * /user/owner:
 *   post:
 *     summary: ADMIN | OWNER creat new owner
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
 *               firstName:
 *                 type: string
 *                 description: first name
 *                 example: 'Sushmit'
 *               lastName:
 *                 type: string
 *                 description: last name
 *                 example: 'katkale'
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: 'katkalesushmit@gmail.com'
 *               password:
 *                 type: string
 *                 description:  password of the user
 *                 example: '12345678'
 *               mobile:
 *                 type: string
 *                 description:  mobile of the user
 *                 example: '7020926583'
 *     responses:
 *       200:
 *         description: return user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: '1'
 *                 firstName:
 *                   type: string
 *                   example: 'Sushmit'
 *                 lastName:
 *                   type: string
 *                   example: 'Katkale'
 *                 email:
 *                   type: string
 *                   example: 'katkalesushmit1189@gmail.com'
 *                 mobile:
 *                   type: string
 *                   example: '7020926583'
 */
Router.post("/owner", mult.upload.single("image"), async (req, res) => {
  try {
    let alreadyPresent = await userDao.findByEmail(req.body.email);

    if (alreadyPresent) {
      return res.status(400).json({
        status: false,
        message: constants.login_messages.userAlreadyFound,
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Profile photo is required!" });
    }
    let body = req.body;
    let addressBody = {
      building_name: body.buildingName,
      line_1: body.line1,
      line_2: body.line2,
      landmark: body.landmark,
      pincode: body.pincode,
      mobile_1: body.mobile1,
      mobile_2: body.mobile2,
      google_map: body.googleMap,
      is_active: "1",
    };

    let data = await addressDao.insert(addressBody);
    let userBody = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      mobile: body.mobile,
      type: constants.user_type.GYM_OWNER,
      is_active: "1",
      fk_profile_image_id: req.file.media.id,
      fk_address_id: data ? data.id : null,
      password: await loginFunction.encryptData(body.password),
    };
    let user = await userDao.insert(userBody);

    if (user) {
      return res.status(200).json(await userDao.mapUserData(user));
    } else {
      return res.status(400).json(constants.error_messages[400]);
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

module.exports = Router;
