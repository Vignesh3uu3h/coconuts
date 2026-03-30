export default (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    coconutsSold: { type: DataTypes.INTEGER, allowNull: false },
    pricePerCoconut: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
    paymentStatus: { type: DataTypes.ENUM('Paid', 'Pending'), allowNull: false, defaultValue: 'Pending' },
    transportNotes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'sales',
    hooks: {
      beforeValidate: (sale) => {
        sale.totalAmount = sale.coconutsSold * sale.pricePerCoconut
      },
    },
  })
  return Sale
}
