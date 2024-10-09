module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "notification",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            content: {
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
            fk_order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_attendence_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "notification",
            timestamps: true,
        }
    );
    return Notification;
};
