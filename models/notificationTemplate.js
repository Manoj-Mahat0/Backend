module.exports = (sequelize, DataTypes) => {
    const NotificationTemplate = sequelize.define(
        "notification_template",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            template: {
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
            fk_event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "notification_template",
            timestamps: true,
        }
    );
    return NotificationTemplate;
};
