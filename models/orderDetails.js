
module.exports = (sequelize, DataTypes) => {
    const OrderDetails = sequelize.define(
        "order_details",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            transaction_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            provider_transaction_id: {
                type: DataTypes.STRING,
            },
            amount_paid: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            validity: {
                type: DataTypes.DECIMAL,
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
            is_fulfilled: {
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
            fk_gym_owmner_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_gym_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_subscription_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            pg_response: {
                type: DataTypes.TEXT,
            }
        },
        {
            tableName: "order_details",
            timestamps: true,
        }
    );
    return OrderDetails;
};
