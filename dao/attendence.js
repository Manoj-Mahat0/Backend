const { where, Op } = require("sequelize");
let db = require("../models");
let Modal = db.attendence;

let getAll = async () => {
  try {
    return await Modal.findAll({
      order: [["createdAt"]],
    });
  } catch (e) {
    return null;
  }
};

let insert = async (body) => {
  try {
    return await Modal.create(body);
  } catch (e) {
    return null;
  }
};

let remove = async (id) => {
  try { 
    let obj = {
      is_active: '0'
    }
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
      where: { [Op.and]: [{ id : id}, { is_active: '1' }]},
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

let getLastAttendence = async (userId) => {
  try {
    return await Modal.findAll({
      where: { fk_user_id: userId },
      order: [["createdAt", "DESC"]],
    });
  } catch (e) {
    return null;
  }
}

let getLastMonthDateById = async (userId) => {
  try {
    const { firstDayOfLastMonth, lastDayOfLastMonth } = getLastMonthDateRange();    
    
    return await Modal.findAll({
      where: {
        fk_user_id: userId,
        createdAt: {
          [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth]
        }
      }
    });
  } catch (e) {
    return null;
  }
}

let getLastMonthDateRange = () => {
  const today = new Date();
  let firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 1);
  let lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Last day of the last month

  return { firstDayOfLastMonth, lastDayOfLastMonth };
}

module.exports = {
  insert,
  getAll,
  remove,
  patch,
  findById,
  hardRemove,
  getLastAttendence,
  getLastMonthDateById,
  getLastMonthDateRange
};
