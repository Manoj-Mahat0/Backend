const loginFunction = require("../helper/loginFunctions");
const constants = require("../config/constant");

let domainConst = constants.domainConst;

const adminEndPoints = ["/user/owner"];

const publicEndPoints = [
  "/test",
  "/login",
  "/login/enc",
  "/login/sign-up",
  "/gym/info/:id",
  "/order/:encData",
  "/order/status/:merchantTransactionId",
  "/order/info/:merchantTransactionId",
];

const privateUserEndPoints = [
  "/login/change-password",
  "/user",
  "/user/profile-image",
  "/user/address",
  "/order/link/:userId/:gymId/:subscriptionId",
  "/subscription/:gymId",
  "/punch/in",
  "/punch/out",
  "/subscription",
  "/attendance/last",
  "/attendance",
  "/purchase",
  "/feedback",
  "/bank",
];

const privateGymOwnerEndPoints = ["/gym", "/gym/profile/:id", "/subscription"];

const fullAccess = [
  "/api-docs",
  "/maintainance",
  "/payment-success",
  "/payment-failed",
];

module.exports = Auth = async (req, res, next) => {
  let endpoint = req.url;

  if (fullAccess.some((ep) => endpoint.startsWith(ep))) {
    next();
    return;
  }

  endpoint = endpoint.substring(domainConst.length);

  const authHeader = req.headers.authorization;

  if (publicEndPoints.some((route) => matchesEndpoint(endpoint, route))) {
    next();
    return;
  }
  console.log(authHeader);
  if (authHeader) {
    let loggedInUser = await loginFunction.verifyToken(authHeader.substring(7));
    if (!loggedInUser) {
      return res.status(403).json("Unauthrozied!");
    }
    console.log(loggedInUser.type, constants.user_type.USER);
    req.loggedInUser = loggedInUser;
    switch (loggedInUser.type) {
      case constants.user_type.ADMIN:
        if (
          adminEndPoints.some((route) => matchesEndpoint(endpoint, route)) ||
          privateUserEndPoints.some((route) =>
            matchesEndpoint(endpoint, route)
          ) ||
          privateGymOwnerEndPoints.some((route) =>
            matchesEndpoint(endpoint, route)
          )
        ) {
          next();
          return;
        }
        break;
      case constants.user_type.GYM_OWNER:
        if (
          privateGymOwnerEndPoints.some((route) =>
            matchesEndpoint(endpoint, route)
          ) ||
          privateUserEndPoints.some((route) => matchesEndpoint(endpoint, route))
        ) {
          next();
          return;
        }
        break;
      case constants.user_type.USER:
        if (
          privateUserEndPoints.some((route) => matchesEndpoint(endpoint, route))
        ) {
          next();
          return;
        }
        break;
      default:
        return res.status(403).json("Unauthrozied!");
    }
    return res.status(403).json("Unauthrozied!");
  }

  return res.status(403).json("Unauthrozied!");
};

const matchesEndpoint = (endpoint, route) => {
  // Handle endpoints with path parameters
  const routeParts = route.split("/");
  const endpointParts = endpoint.split("/");

  if (routeParts.length !== endpointParts.length) return false;

  return routeParts.every((part, index) => {
    if (part.startsWith(":")) return true; // Parameter match
    return part === endpointParts[index]; // Static match
  });
};
