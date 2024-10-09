module.exports = (sequelize, DataTypes) => {
    const GymOwnerPayments = sequelize.define(
        "gym_owner_payments",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            amount_paid: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            note: {
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
            fk_payer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fk_proof_media_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "gym_owner_payments",
            timestamps: true,
        }
    );
    return GymOwnerPayments;
};
