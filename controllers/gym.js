const constants = require("../config/constant");
const gymDetailsDao = require("../dao/gymDetails");
const addressDao = require("../dao/address");
const mediaDao = require("../dao/media");
const userDao = require("../dao/user");

let addGym = async (req, res) => {
  try {
    let body = req.body;
    let prevGym = await gymDetailsDao.findByName(req.body.name);

    if (prevGym) {
      return res.status(400).json("Gym with this name already exists");
    }

    if (!req.file) {
      return res.status(400).json("Media not found");
    }
    console.log(req.body);

    let gymOwnerId;
    if (req.loggedInUser.type === constants.user_type.ADMIN) {
      gymOwnerId = req.body.gymOwnerId;
      if (!gymOwnerId) {
        return res.status(400).json("Must Provide gym owner id");
      }
    } else {
      gymOwnerId = req.loggedInUser.id;
    }

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

    let request = {
      name: body.name,
      description: body.description,
      charges_per_entry: parseFloat(body.chargesPerEntry).toFixed(2),
      is_active: "1",
      fk_address_id: data ? data.id : null,
      fk_gym_owner_id: gymOwnerId,
      fk_logo_id: req.file.media.id,
      capacity: body.capacity,
      latitude: body.latitude,
      longitude: body.longitude,
      unisex: body.unisex,
      trainer_available: body.trainer_available,
      address: body.buildingName + " " + body.landmark,
    };
    console.log(request);

    let gymInfo = await gymDetailsDao.insert(request);
    console.log("gymInfo", gymInfo);

    if (gymInfo) {
      let response = {
        name: gymInfo.name,
        description: gymInfo.description,
        chargesPerEntry: gymInfo.charges_per_entry,
        address: addressBody,
        logo: req.file.media,
      };
      return res.status(200).json(response);
    } else {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

let gymInfo = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json("Id is required");
    }

    if (req.params.id == "all") {
      let gyms = await gymDetailsDao.getAll();
      let response = [];
      for (let gym of gyms) {
        response.push(await mapGymDetails(gym));
      }
      return res.status(400).json(response);
    } else {
      return res
        .status(400)
        .json(await mapGymDetails(await gymDetailsDao.findById(req.params.id)));
    }
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
};

let mapGymDetails = async (gym) => {
  if (!gym) {
    return;
  }

  let addressBody = null;
  let logoBody = null;
  let gymOwnerBody = null;

  if (gym.fk_address_id) {
    let address = await addressDao.findById(gym.fk_address_id);
    addressBody = {
      building_name: address.building_name,
      line_1: address.line_1,
      line_2: address.line_2,
      landmark: address.landmark,
      pincode: address.pincode,
      mobile_1: address.mobile_1,
      mobile_2: address.mobile_2,
      google_map: address.google_map,
      is_active: address.is_active,
    };
  }

  if (gym.fk_logo_id) {
    let logo = await mediaDao.findById(gym.fk_logo_id);
    logoBody = {
      extension: logo.extension,
      path: logo.path,
      type: logo.type,
      is_active: logo.is_active,
    };
  }

  if (gym.fk_gym_owner_id) {
    let gymOwner = await userDao.findById(gym.fk_gym_owner_id);
    gymOwnerBody = {
      firstName: gymOwner.first_name,
      lastName: gymOwner.last_name,
      email: gymOwner.email,
      mobile: gymOwner.mobile,
      type: gymOwner.type,
      is_active: gymOwner.is_active,
    };
  }

  let data = {
    name: gym.name,
    description: gym.description,
    address: addressBody,
    logo: logoBody,
    gymOwner: gymOwnerBody,
  };

  return data;
};

let gymOwnerProfile = async (req, res) => {
  try {
    let gymOwnerId = req.params.id;
    if (!gymOwnerId) {
      return res.status(400).json("Gym owner id is required");
    }

    let gymOwner = await userDao.findById(gymOwnerId);
    console.log(gymOwner);
    if (!gymOwner) {
      return res.status(400).json("Gym owner not found");
    }

    return res.status(200).json({
      gymOwnerName: gymOwner.first_name + " " + gymOwner.last_name,
      gymOwnerNikename: gymOwner.nikename,
      totalMember: "0",
      totalActiveMembers: "0",
      totalRevenue: "0",
    });
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
};

module.exports = {
  addGym,
  gymInfo,
  gymOwnerProfile,
};
