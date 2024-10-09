module.exports = (sequelize, DataTypes) => {
    const SubscriptionsPlans = sequelize.define(
        "subscriptions_plans",
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
            tag: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            },
            validity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            validity_measure: {
                type: DataTypes.STRING,
                allowNull: false,
                default: 'D',
                validate: {
                    isIn: [['D', 'M', 'Y']]
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
            fk_gym_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "subscriptions_plans",
            timestamps: true,
        }
    );
    return SubscriptionsPlans;
};
