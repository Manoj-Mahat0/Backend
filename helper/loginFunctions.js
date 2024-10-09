const ncrypt = require("ncrypt-js");
const { user } = require("../models");
const userDao = require("../dao/user");
const { Where, Op } = require("sequelize/lib/utils");
var jwt = require('jsonwebtoken');

const verifyToken = async (token) => {

    try {
        let decoded = jwt.verify(token, process.env.SECRET ? process.env.SECRET : "SUPER_SECRET");
        const data = await userDao.findByEmail(decoded.data.email);
        return data;
    } catch (error) {
        return false;
    }

}

const generateToken = async (data) => {

    let reducedDate = {
        mobile: data.mobile,
        email: data.email
    }

    try {
        let token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            data: reducedDate
        }, process.env.SECRET ? process.env.SECRET : "SUPER_SECRET");
        return token;
    } catch (error) {
        return false;
    }

}

const encryptData = async (data) => {
    const ncr = new ncrypt(process.env.SECRET ? process.env.SECRET : "SUPER_SECRET");
    return ncr.encrypt(data);
}

const verifyUser = (user, body) => {
    const ncr = new ncrypt(process.env.SECRET ? process.env.SECRET : "SUPER_SECRET");
    const decryptedData = ncr.decrypt(user.password);
    return decryptedData ? body.password === decryptedData : false;
}

const isSame = (pass, encryptedPass) => {
    const ncr = new ncrypt(process.env.SECRET ? process.env.SECRET : "SUPER_SECRET");
    return pass === ncr.decrypt(encryptedPass);
}

const decryptData = async (data) => {
    const ncr = new ncrypt(process.env.SECRET ? process.env.SECRET : "SUPER_SECRET");
    return ncr.decrypt(data);
}

module.exports = {
    verifyToken,
    generateToken,
    encryptData,
    verifyUser,
    isSame,
    decryptData
};
