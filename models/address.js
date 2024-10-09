module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define(
        "address",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            building_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            line_1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            line_2: {
                type: DataTypes.STRING,
            },
            landmark: {
                type: DataTypes.STRING,
            },
            google_map: {
                type: DataTypes.STRING,
            },
            pincode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mobile_1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mobile_2: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_active: {
                type: DataTypes.STRING,
                allowNull: false,
                default: '1',
                validate: {
                    isIn: [['1', '0']]
                }
            },
        },
        {
            tableName: "address",
            timestamps: true,
        }
    );
    return Address;
};
