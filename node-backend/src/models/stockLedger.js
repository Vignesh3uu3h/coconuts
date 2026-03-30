export default (sequelize, DataTypes) => {
  const StockLedger = sequelize.define('StockLedger', {
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    type: { type: DataTypes.ENUM('IN', 'OUT'), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    referenceType: { type: DataTypes.STRING, allowNull: false },
    referenceId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'stock_ledgers',
  })
  return StockLedger
}
