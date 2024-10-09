const { where, Op } = require("sequelize");
let db = require("../models");
let Modal = db.orderDetails;

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
      where: { [Op.and]: [{ id: id }, { is_active: '1' }] },
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

let findByTransactionId = async (transactionId) => {
  try {
    let data = await Modal.findAll({
      where: { [Op.and]: [{ transaction_id: transactionId }, { is_active: '1' }] },
    });

    return data && data.length == 1 ? data[0] : null;
  } catch (e) {
    return null;
  }
}

let updateByMerchantTransactionId = async (body, merchantTransactionId) => {
  try {
    let data = await Modal.update(body, {
      where: { transaction_id: merchantTransactionId },
    });

    if(data && data.length == 1 && data[0] == 1) {
        return await findByTransactionId(merchantTransactionId);              
    }else{
        return null;
    }
  } catch (e) {
    return null;
  }
}

let getAllByUserId = async (userId) => {
  try {
    return await Modal.findAll({
      where: { [Op.and]: [{ fk_user_id: userId }, { is_active: '1' }] },
      order: [["createdAt", "DESC"]],
    });
  } catch (e) {
    return null;
  }
}

module.exports = {
  insert,
  getAll,
  remove,
  patch,
  findById,
  hardRemove,
  updateByMerchantTransactionId,
  findByTransactionId,
  getAllByUserId
};
