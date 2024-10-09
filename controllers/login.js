const express = require("express");
const userDao = require("../dao/user");
const constants = require("../config/constant");
const Router = express.Router();

const loginFunction = require("../helper/loginFunctions");
const util = require("../helper/util");
const nodemailer = require("../helper/nodemailer");

/**
 * @swagger
 * /login:
 *   post:
 *     summary: OPEN Returns a login token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: 'katkalesushmit@gmail.com'
 *               password:
 *                 type: string
 *                 description:  password of the user
 *                 example: '12345678'
 *     responses:
 *       200:
 *         description: return token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 */
Router.post("/", async (req, res) => {
  try {
    let body = req.body;
    let user = await userDao.findByEmail(body.email);
    if (user) {
      let verifyUser = loginFunction.verifyUser(user, body);
      if (verifyUser) {
        let token = await loginFunction.generateToken(user);
        return res.status(200).json({ token: token });
      } else {
        return res.status(404).json(constants.login_messages.wrongCombination);
      }
    } else {
      return res.status(404).json(constants.login_messages.userNotFound);
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

/**
 * @swagger
 * /login/sign-up:
 *   post:
 *     summary: OPEN create new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               userType:
 *                 type: string
 *                 example: 'OWNER'
 *                 possible values: ['OWNER', 'USER']
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
Router.post("/sign-up", async (req, res) => {
  try {
    let body = req.body;
    console.log(req.body);

    let user = await userDao.findByEmail(body.email);
    if (user) {
      return res.status(409).json(constants.login_messages.userAlreadyFound);
    } else {
      let password = body.password;
      if (!password) {
        password = util.generatePassword();
      } else if (password.length < 8) {
        return res.status(400).json(constants.login_messages.passwordLength);
      }

      let user_type =
        body.userType && body.userType.toUpperCase() === "ADMIN"
          ? constants.user_type.ADMIN
          : body.userType && body.userType[0].toUpperCase() === "O"
          ? constants.user_type.GYM_OWNER
          : constants.user_type.USER;

      console.log(user_type);

      let createBody = {
        password: await loginFunction.encryptData(password),
        type: user_type,
        is_active: "1",
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        mobile: body.mobile,
        nikename: body.nikename,
      };

      if (
        nodemailer.sendWelcomeMailWithPassword(
          [body.email],
          body.email,
          password
        )
      ) {
        let user = await userDao.insert(createBody);
        if (user) {
          return res.status(200).json(await userDao.mapUserData(user));
        }
      }

      return res.status(500).json("Unable to create user");
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

// @param email
// @param previousPassword
// @param newPassword
/**
 * @swagger
 * /login/change-password:
 *   post:
 *     summary: ADMIN | OWNER | USER change user password
 *     security:
 *       - bearerAuth: []
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
 *               previousPassword:
 *                 type: string
 *                 description: first name
 *                 example: '12345678'
 *               newPassword:
 *                 type: string
 *                 description: last name
 *                 example: '12345678'
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: 'katkalesushmit@gmail.com'
 *     responses:
 *       200:
 *         description: return boolean
 *         content:
 *           boolean:
 *               example: true
 */
Router.post("/change-password", async (req, res) => {
  try {
    let body = req.body;

    if (body.newPassword.length < 8) {
      return res.status(400).json(constants.login_messages.passwordLength);
    }

    let user = await userDao.findByEmail(body.email);
    if (user) {
      if (loginFunction.isSame(body.previousPassword, user.password)) {
        let updatedUser = await userDao.patch(user.id, {
          password: await loginFunction.encryptData(body.newPassword),
        });
        return res.status(200).json(updatedUser.includes(1));
      }
    } else {
      return res.status(404).json(constants.login_messages.userNotFound);
    }
    return res.status(500).json(constants.error_messages[500]);
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

Router.get("/enc", async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        loginFunction.encryptData(
          req.query.password ? req.query.password : null
        )
      );
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
});

module.exports = Router;
