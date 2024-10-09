
module.exports = (sequelize, DataTypes) => {
    const ActiveSubscriptions = sequelize.define(
        "active_subscriptions",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            remaining_amount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            valid_till: {
                type: DataTypes.DATE,
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
            fk_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_subscription_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "active_subscriptions",
            timestamps: true,
        }
    );
    return ActiveSubscriptions;
};
