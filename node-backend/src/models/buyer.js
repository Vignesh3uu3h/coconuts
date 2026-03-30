export default (sequelize, DataTypes) => {
  const Buyer = sequelize.define('Buyer', {
    businessName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'buyers',
  })
  return Buyer
}
