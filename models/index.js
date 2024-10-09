const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    logging: false,
    dialect: "mysql",
  }
);

db = {};
db.user = require("./user")(sequelize, DataTypes);
db.activeSubscriptions = require("./activeSubscriptions")(sequelize, DataTypes);
db.address = require("./address")(sequelize, DataTypes);
db.attendence = require("./attendence")(sequelize, DataTypes);
db.bank = require("./bank")(sequelize, DataTypes);
db.gymDetails = require("./gymDetails")(sequelize, DataTypes);
db.gymOwnerPayments = require("./gymOwnerPayments")(sequelize, DataTypes);
db.media = require("./media")(sequelize, DataTypes);
db.notificationEvent = require("./notificationEvent")(sequelize, DataTypes);
db.notifications = require("./notifications")(sequelize, DataTypes);
db.notificationTemplate = require("./notificationTemplate")(
  sequelize,
  DataTypes
);
db.offer = require("./offer")(sequelize, DataTypes);
db.orderDetails = require("./orderDetails")(sequelize, DataTypes);
db.subscriptionPlans = require("./subscriptionPlans")(sequelize, DataTypes);
db.feedback = require("./feedback")(sequelize, DataTypes);
db.qrcode = require("./qrcode")(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully with DB.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

db.sequelize.sync({ alter: true });
// db.sequelize.sync();
connectToDB();

module.exports = db;
