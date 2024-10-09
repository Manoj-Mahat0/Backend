module.exports = (sequelize, DataTypes) => {
    const Attendence = sequelize.define(
        "attendence",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            total_cost: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            location_link: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_manual: {
                type: DataTypes.STRING,
                allowNull: false,
                default: '1',
                validate: {
                    isIn: [['1', '0']]
                }
            },
            is_active: {
                type: DataTypes.STRING,
                allowNull: false,
                default: '1',
                validate: {
                    isIn: [['1', '0']]
                }
            },
            fk_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_gym_owner_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_gym_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_media_id: {
                type: DataTypes.INTEGER,
            },
            fk_active_subscription_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "attendence",
            timestamps: true,
        }
    );
    return Attendence;
};
