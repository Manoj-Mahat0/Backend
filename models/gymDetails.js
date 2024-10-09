module.exports = (sequelize, DataTypes) => {
  const GymDetails = sequelize.define(
    "gym_details",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      charges_per_entry: {
        type: DataTypes.DECIMAL(10, 2),
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 6),
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 6),
      },
      unisex: {
        type: DataTypes.BOOLEAN,
        default: "1",
        validate: {
          isIn: [["1", "0"]],
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trainer_available: {
        type: DataTypes.BOOLEAN,
        default: "1",
        validate: {
          isIn: [["1", "0"]],
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
      fk_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fk_gym_owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fk_logo_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "gym_details",
      timestamps: true,
    }
  );
  return GymDetails;
};
