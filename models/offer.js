module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define(
        "offer",
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
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                default: 'F',
                validate: {
                    isIn: [['F', 'P']]
                }
            },
            value: {
                type: DataTypes.DECIMAL,
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
            fk_subscription_id: {
                type: DataTypes.INTEGER,
            },
            fk_gym_id: {
                type: DataTypes.INTEGER,
            },
            fk_user_id: {
                type: DataTypes.INTEGER,
            },
            user_created: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tag: {
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "offer",
            timestamps: true,
        }
    );
    return Offer;
};
