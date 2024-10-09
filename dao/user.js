const { where, Op } = require("sequelize");
let db = require("../models");
let addressDao = require("./address");
let mediaDao = require("./media");
let Modal = db.user;

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

let findByMobile = async (mobile) => {
  try {

    let data = await Modal.findAll({
      where: { [Op.and]: [{ mobile: mobile }, { is_active: '1' }] },
    });

    return data && data.length == 1 ? data[0] : null;
  } catch (e) {
    return null;
  }
};

let findByEmail = async (email) => {
  try {

    let data = await Modal.findAll({
      where: { [Op.and]: [{ email: email }, { is_active: '1' }] },
    });

    return data ? data[0] : null;
  } catch (e) {
    log
    return null;
  }
};

let mapUserData = async (user) => {
  let userInfo = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    mobile: user.mobile,
    type: user.type,
  }
  if (user.fk_address_id) {
    let address = await addressDao.findById(user.fk_address_id);
    if (address) {
      let userAddress = {
        buildingName: address.building_name,
        line1: address.line_1,
        line2: address.line_2,
        landmark: address.landmark,
        pincode: address.pincode,
        mobile1: address.mobile_1,
        mobile2: address.mobile_2,
        googleMap: address.google_map
      }
      userInfo.address = userAddress;
    }
  }
  if (user.fk_profile_image_id) {
    let profileImage = await mediaDao.findById(user.fk_profile_image_id);
    if (profileImage) {
      let profileImageObj = {
        extension: profileImage.extension,
        path: profileImage.path,
        type: profileImage.type
      }
      userInfo.profileImageObj = profileImageObj;
    }
  }

  return userInfo;
}

let mapUserDataById = async (id) => {
  let user = await findById(id); 
  if(user){
    return await mapUserData(user);
  }
  
}

module.exports = {
  insert,
  getAll,
  remove,
  patch,
  findById,
  hardRemove,
  findByMobile,
  findByEmail,
  mapUserData,
  mapUserDataById
};
