module.exports = (sequelize, DataTypes) => {
  const Qrcode = sequelize.define(
    "Qrcode",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qrcodeid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "1",
        validate: {
          isIn: [["1", "0"]],
        },
      },
      fk_user_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "Qrcode",
      timestamps: true,
    }
  );
  return Qrcode;
};
