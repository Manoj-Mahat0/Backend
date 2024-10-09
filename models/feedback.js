module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define(
        "feedback",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            value: {
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
            fk_user_id: {
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "feedback",
            timestamps: true,
        }
    );
    return Feedback;
};
