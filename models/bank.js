module.exports = (sequelize, DataTypes) => {
    const Bank = sequelize.define(
        "bank",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            bank_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            account_holder_name: {
                type: DataTypes.STRING,
            },
            account_number: {
                type: DataTypes.STRING,
            },
            account_idfc_code: {
                type: DataTypes.STRING,
            },
            upi_id: {
                type: DataTypes.STRING,
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
            fk_qr_code:{
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "bank",
            timestamps: true,
        }
    );
    return Bank;
};
