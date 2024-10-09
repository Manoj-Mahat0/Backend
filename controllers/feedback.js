let db = require("../models");
let Modal = db.feedback;

const addFeedback = async (req, res) => {
  let loggedInUser = req.loggedInUser;
  if (!loggedInUser) {
    return res.status(400).json("User not found");
  }
  let body = req.body;
  let request = {
    fk_user_id: loggedInUser.id,
    value: body.value,
    is_active: "1",
  };

  let feedback = await Modal.create(request);

  if (!feedback) {
    return res.status(400).json("Feedback not submitted");
  }

  return res.status(200).json("Feedback submitted successfully");
};

module.exports = {
  addFeedback,
};
