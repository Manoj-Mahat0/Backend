const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

let db = require("../models");
let mediaDao = require("../dao/media");
let media = db.media;
let Qrcode = db.qrcode;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.env.UPLOAD_PATH, file.fieldname); // Ensure the correct path is set

    // Check if the directory exists, and create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory recursively
    }

    return cb(null, uploadDir);
  },
  filename: async function (req, file, cb) {
    let fName = `${Date.now()}_${file.originalname}`;
    try {
      let data = await media.create({
        extension: file.mimetype,
        type: `${file.fieldname}`,
        path: `${process.env.UPLOAD_PATH}/${file.fieldname}/${fName}`,
        is_active: "1",
      });
      file.media = data;
      return cb(null, fName);
    } catch (err) {
      console.error("Error saving media to DB:", err);
      return cb(err);
    }
  },
});

const qrcode = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.env.UPLOAD_PATH, file.fieldname); // Ensure the correct path is set

    // Check if the directory exists, and create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory recursively
    }

    return cb(null, uploadDir);
  },
  filename: async function (req, file, cb) {
    let fName = `${Date.now()}_${file.originalname}`;
    try {
      const path = `${process.env.UPLOAD_PATH}/${file.fieldname}/${fName}`;

      file.path = path;
      return cb(null, fName);
    } catch (err) {
      console.error("Error saving media to DB:", err);
      return cb(err);
    }
  },
});

// Delete the previous file (if needed)
const deletePreviousFile = async (id) => {
  if (!id) return;

  let mediaData = await mediaDao.findById(id);
  if (mediaData) {
    fs.unlink(mediaData.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
      mediaData.destroy();
    });
  }
};

const upload = multer({ storage });
const qrcodeUpload = multer({ storage: qrcode });

module.exports = {
  upload,
  deletePreviousFile,
  qrcodeUpload,
};
