module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nikename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 15],
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["ADMIN", "USER", "GYM_OWNER"]],
        },
      },
      is_active: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "1",
        validate: {
          isIn: [["1", "0"]],
        },
      },
      fk_profile_image_id: {
        type: DataTypes.INTEGER,
      },
      fk_address_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "user",
      timestamps: true,
    }
  );
  return User;
};
