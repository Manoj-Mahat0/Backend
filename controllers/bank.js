let db = require("../models");
let Qrcode = db.qrcode;
let Bank = db.bank;

const addBank = async (req, res) => {
  let loggedInUser = req.loggedInUser;

  if (!loggedInUser) {
    return res.status(400).json("User not found");
  }

  let body = req.body;

  try {
    let fk_qr_code = null;

    // Check if an image is uploaded
    if (req.file && req.file.path) {
      // Creating a new QR code record
      let qrCode = await Qrcode.create({
        path: req.file.path,
        qrcodeid: body.qrid, // Generating a random qrcodeid
        fk_user_id: loggedInUser.id,
        is_active: "1",
      });

      // If QR code creation fails
      if (!qrCode) {
        return res.status(400).json("QR code could not be added");
      }

      fk_qr_code = qrCode.id; // Set the foreign key to the new QR code record
    }

    // Creating the bank entry request object
    let request = {
      fk_user_id: loggedInUser.id,
      bank_name: body.bank_name,
      account_holder_name: body.account_holder_name,
      account_number: body.account_number,
      account_idfc_code: body.account_idfc_code,
      upi_id: body.upi_id,
      is_active: "1", // Default to active
      fk_qr_code: fk_qr_code, // If image exists, link the QR code
    };

    // Creating the bank entry in the database
    let bank = await Bank.create(request);

    if (!bank) {
      return res.status(400).json("Bank details could not be added");
    }

    return res.status(200).json("Bank details added successfully");
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while adding the bank details",
      details: error.message,
    });
  }
};

module.exports = {
  addBank,
};
