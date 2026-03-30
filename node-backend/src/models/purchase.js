export default (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    numberOfCoconuts: { type: DataTypes.INTEGER, allowNull: false },
    pricePerCoconut: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
    paymentStatus: { type: DataTypes.ENUM('Paid', 'Pending'), allowNull: false, defaultValue: 'Pending' },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'purchases',
    hooks: {
      beforeValidate: (purchase) => {
        purchase.totalAmount = purchase.numberOfCoconuts * purchase.pricePerCoconut
      },
    },
  })
  return Purchase
}
