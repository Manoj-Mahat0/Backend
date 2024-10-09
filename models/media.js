module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define(
        "media",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            extension: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                default: 'image',
                validate: {
                    isIn: [['image', 'video', 'pdf']]
                }
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
            tableName: "media",
            timestamps: true,
        }
    );
    return Media;
};
