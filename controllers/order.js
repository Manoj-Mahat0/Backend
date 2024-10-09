const constants = require("../config/constant");
const orderDao = require("../dao/orderDetails");
const userDao = require("../dao/user");
const phonePe = require("../controllers/phonePay");
const subscriptionDao = require("../dao/subscriptionPlans");
const gymDao = require("../dao/gymDetails");
const uniqid = require("uniqid");
const loginFunctions = require("../helper/loginFunctions");

let sendPaymentLink = async (req, res) => {
  try {
    let userId = req.params.userId;
    let gymId = req.params.gymId;
    let subscriptionId = req.params.subscriptionId;

    let body = {
      userId: userId,
      gymId: gymId,
      subscriptionId: subscriptionId,
    };

    let encData = await loginFunctions.encryptData(JSON.stringify(body));

    if (encData) {
      let pre = req.headers.host.includes("localhost") ? "http://" : "https://";
      let redirectionLink = `${pre}${req.headers.host}${constants.domainConst}/order/${encData}`;
      return res.status(200).json({ redirectLink: redirectionLink });
    }
    return res.status(500).json(constants.error_messages[500]);
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
};

let addOrder = async (req, res, next) => {
  try {
    let jsonString = await loginFunctions.decryptData(req.params.encData);

    const decriptedData = JSON.parse(jsonString);

    let userId = decriptedData.userId;
    let gymId = decriptedData.gymId;
    let subscriptionId = decriptedData.subscriptionId;

    let subscription = await subscriptionDao.findById(subscriptionId);
    let gym = await gymDao.findById(gymId);

    if (subscription && gym && subscription.fk_gym_id == gymId) {
      let request = {
        fk_user_id: userId,
        fk_gym_owmner_id: gym.fk_gym_owner_id,
        fk_gym_id: gymId,
        fk_subscription_id: subscriptionId,
        amount_paid: parseFloat(subscription.price, 2),
        validity: subscription.validity,
        validity_measure: subscription.validity_measure,
        is_fulfilled: "0",
        is_active: "1",
        transaction_id: uniqid(),
      };

      let order = await orderDao.insert(request);

      if (order) {
        return phonePe.payApi(
          req,
          res,
          next,
          order.transaction_id,
          order.fk_user_id,
          parseFloat(order.amount_paid, 2)
        );
      } else {
        return res.status(500).json(constants.error_messages[500]);
      }
    }
    return res.status(500).json(constants.error_messages[500]);
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
};

let updateOrderStatus = async (req, res) => {
  try {
    return phonePe.setStatus(req, res);
  } catch (error) {
    return res.status(500).json(constants.error_messages[500]);
  }
};

let getOrderInfo = async (req, res) => {
  try {
    let merchantTransactionId = req.params.merchantTransactionId;

    let order = await orderDao.findByTransactionId(merchantTransactionId);

    if (order) {
      if (order.provider_transaction_id == null || order.is_fulfilled == "0") {
        return res.status(200).json({
          status: "Failed",
        });
      }

      let user = await userDao.findById(order.fk_user_id);
      let subscription = await subscriptionDao.findById(
        order.fk_subscription_id
      );

      if (!user || !subscription) {
        return res.status(500).json(constants.error_messages[500]);
      }

      let response = {
        status: "Success",
        userName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        subscription: subscription.name,
        validity: `${subscription.validity} ${getFullValidityMeasure(
          subscription.validity_measure
        )}`,
        amountPaid: `₹ ${parseFloat(order.amount_paid, 2).toFixed(2)}/-`,
        transactionId: order.provider_transaction_id,
      };
      return res.status(200).json(response);
    }
    return res.status(200).json({
      status: "Failed",
    });
  } catch (error) {
    return res.status(200).json({
      status: "Failed",
    });
  }
};

let getFullValidityMeasure = (measure) => {
  switch (measure) {
    case "D":
      return "Days";
    case "M":
      return "Months";
    case "Y":
      return "Years";
    default:
      return "Days";
  }
};

let getAllOrders = async (req, res) => {
  try {
    console.log("IN ORDER");

    let loggedInUser = req.loggedInUser;
    console.log(loggedInUser);

    if (!loggedInUser) {
      return res.status(400).json("User not found");
    }
    let orders = await orderDao.getAllByUserId(loggedInUser.id);
    console.log(orders);

    let response = [];
    if (orders) {
      for (let i = 0; i < orders.length; i++) {
        let user = await userDao.findById(orders[i].fk_user_id);
        let gym = await gymDao.findById(orders[i].fk_gym_id);
        let subscription = await subscriptionDao.findById(
          orders[i].fk_subscription_id
        );
        if (user && gym && subscription) {
          let order = {
            gymName: gym.name,
            subscription: subscription.name,
            validity: `${subscription.validity} ${getFullValidityMeasure(
              subscription.validity_measure
            )}`,
            amountPaid: `₹ ${parseFloat(orders[i].amount_paid, 2).toFixed(
              2
            )}/-`,
            transactionId: orders[i].provider_transaction_id,
            status: orders[i].is_fulfilled == "1" ? "Success" : "Failed",
            createdAt: orders[i].createdAt,
          };
          response.push(order);
        }
      }
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    return res.status(500).json(constants.error_messages[500]);
  }
};

module.exports = {
  addOrder,
  updateOrderStatus,
  sendPaymentLink,
  getOrderInfo,
  getAllOrders,
};
