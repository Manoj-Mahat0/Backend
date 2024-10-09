const { where, Op } = require("sequelize");
let db = require("../models");
let Modal = db.gymDetails;

let getAll = async () => {
  try {
    return await Modal.findAll({
      order: [["createdAt"]],
      where: { is_active: "1" },
    });
  } catch (e) {
    return null;
  }
};

let insert = async (body) => {
  try {
    return await Modal.create(body);
  } catch (e) {
    console.log(e);
    return null;
  }
};

let remove = async (id) => {
  try {
    let obj = {
      is_active: "0",
    };
    return patch(id, obj);
  } catch (e) {
    return null;
  }
};

let patch = async (id, body) => {
  try {
    return await Modal.update(body, {
      where: { id: id },
    });
  } catch (e) {
    return null;
  }
};

let findById = async (id) => {
  try {
    let data = await Modal.findAll({
      where: { [Op.and]: [{ id: id }, { is_active: "1" }] },
    });

    return data && data.length == 1 ? data[0] : null;
  } catch (e) {
    return null;
  }
};

let hardRemove = async (id) => {
  try {
    let present = await findById(id);
    const isDeleted = await Modal.destroy({
      where: { id: id },
    });
    if (isDeleted) {
      return present;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

let findByName = async (name) => {
  try {
    let data = await Modal.findAll({
      where: { [Op.and]: [{ name: name }, { is_active: "1" }] },
    });

    return data ? data[0] : null;
  } catch (e) {
    return null;
  }
};

module.exports = {
  insert,
  getAll,
  remove,
  patch,
  findById,
  hardRemove,
  findByName,
};
