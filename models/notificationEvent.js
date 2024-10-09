
module.exports = (sequelize, DataTypes) => {
    const NotificationEvent = sequelize.define(
        "notification_event",
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
            is_active: {
                type: DataTypes.STRING,
                allowNull: false,
                default: '1',
                validate: {
                    isIn: [['1', '0']]
                }
            }
        },
        {
            tableName: "notification_event",
            timestamps: true,
        }
    );
    return NotificationEvent;
};
